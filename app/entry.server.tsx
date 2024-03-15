import { PassThrough } from 'stream';
import createEmotionCache from '@emotion/cache';
import { CacheProvider as EmotionCacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { createReadableStreamFromReadable, EntryContext } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import * as isbotModule from 'isbot';
import { renderToPipeableStream } from 'react-dom/server';

const ABORT_DELAY = 5000;

export default function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
) {
    return isBotRequest(request.headers.get('user-agent'))
        ? handleBotRequest(request, responseStatusCode, responseHeaders, remixContext)
        : handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext);
}

// We have some Remix apps in the wild already running with isbot@3 so we need
// to maintain backwards compatibility even though we want new apps to use
// isbot@4.  That way, we can ship this as a minor Semver update to @remix-run/dev.
function isBotRequest(userAgent: string | null) {
    if (!userAgent) {
        return false;
    }

    // isbot >= 3.8.0, >4
    if ('isbot' in isbotModule && typeof isbotModule.isbot === 'function') {
        return isbotModule.isbot(userAgent);
    }

    // isbot < 3.8.0
    if ('default' in isbotModule && typeof isbotModule.default === 'function') {
        return isbotModule.default(userAgent);
    }

    return false;
}

function handleBotRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
) {
    return new Promise((resolve, reject) => {
        let shellRendered = false;
        const emotionCache = createEmotionCache({ key: 'css' });

        const { pipe, abort } = renderToPipeableStream(
            <EmotionCacheProvider value={emotionCache}>
                <RemixServer context={remixContext} url={request.url} />
            </EmotionCacheProvider>,
            {
                onAllReady: () => {
                    shellRendered = true;
                    const reactBody = new PassThrough();
                    const emotionServer = createEmotionServer(emotionCache);

                    const bodyWithStyles = emotionServer.renderStylesToNodeStream();
                    reactBody.pipe(bodyWithStyles);
                    const stream = createReadableStreamFromReadable(reactBody);

                    responseHeaders.set('Content-Type', 'text/html');

                    resolve(
                        new Response(stream, {
                            headers: responseHeaders,
                            status: responseStatusCode,
                        }),
                    );

                    pipe(reactBody);
                },
                onShellError: (error: unknown) => {
                    reject(error);
                },
                onError: (error: unknown) => {
                    responseStatusCode = 500;
                    // Log streaming rendering errors from inside the shell.  Don't log
                    // errors encountered during initial shell rendering since they'll
                    // reject and get logged in handleDocumentRequest.
                    if (shellRendered) {
                        console.error(error);
                    }
                },
            },
        );

        setTimeout(abort, ABORT_DELAY);
    });
}

function handleBrowserRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
) {
    return new Promise((resolve, reject) => {
        let shellRendered = false;
        const emotionCache = createEmotionCache({ key: 'cha' });

        const { pipe, abort } = renderToPipeableStream(
            <EmotionCacheProvider value={emotionCache}>
                <RemixServer context={remixContext} url={request.url} />
            </EmotionCacheProvider>,
            {
                onShellReady: () => {
                    shellRendered = true;
                    const reactBody = new PassThrough();
                    const emotionServer = createEmotionServer(emotionCache);

                    const bodyWithStyles = emotionServer.renderStylesToNodeStream();
                    reactBody.pipe(bodyWithStyles);
                    const stream = createReadableStreamFromReadable(reactBody);

                    responseHeaders.set('Content-Type', 'text/html');

                    resolve(
                        new Response(stream, {
                            headers: responseHeaders,
                            status: responseStatusCode,
                        }),
                    );

                    pipe(reactBody);
                },
                onShellError: (error: unknown) => {
                    reject(error);
                },
                onError: (error: unknown) => {
                    responseStatusCode = 500;
                    // Log streaming rendering errors from inside the shell.  Don't log
                    // errors encountered during initial shell rendering since they'll
                    // reject and get logged in handleDocumentRequest.
                    if (shellRendered) {
                        console.error(error);
                    }
                },
            },
        );

        setTimeout(abort, ABORT_DELAY);
    });
}
