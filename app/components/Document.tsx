import { Links, LiveReload, Meta, Scripts, ScrollRestoration } from '@remix-run/react';
import { useContext, useEffect, useMemo } from 'react';
import { ChakraProvider, cookieStorageManagerSSR } from '@chakra-ui/react';
import theme from '~/theme';
import { EmotionCache, withEmotionCache } from '@emotion/react';
import { ClientStyleContext } from '~/application/context';

type Props = {
    cookies?: string;
    children: React.ReactNode;
    title?: string;
};

function Document({ children, title = 'App title', cookies = '' }: Props, emotionCache: EmotionCache) {
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
        // re-link sheet container
        emotionCache.sheet.container = document.head;
        // re-inject tags
        const tags = emotionCache.sheet.tags;
        emotionCache.sheet.flush();
        tags.forEach((tag) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (emotionCache.sheet as any)._insertTag(tag);
        });
        // reset cache to reapply global styles
        clientStyleData?.reset();
    }, []);

    function getColorMode(cookies: string) {
        const match = cookies.match(new RegExp(`(^| )${CHAKRA_COOKIE_COLOR_KEY}=([^;]+)`));
        return match == null ? void 0 : match[2];
    }

    // here we can set the default color mode. If we set it to null,
    // there's no way for us to know what is the the user's preferred theme
    // so the client will have to figure out and maybe there'll be a flash the first time the user visits us.
    const DEFAULT_COLOR_MODE: 'dark' | 'light' | null = 'dark';

    const CHAKRA_COOKIE_COLOR_KEY = 'chakra-ui-color-mode';

    // the client get the cookies from the document
    // because when we do a client routing, the loader can have stored an outdated value
    if (typeof document !== 'undefined') {
        cookies = document.cookie;
    }

    // get and store the color mode from the cookies.
    // It'll update the cookies if there isn't any and we have set a default value
    const colorMode = useMemo(() => {
        let color = getColorMode(cookies);

        if (!color && DEFAULT_COLOR_MODE) {
            cookies += ` ${CHAKRA_COOKIE_COLOR_KEY}=${DEFAULT_COLOR_MODE}`;
            color = DEFAULT_COLOR_MODE;
        }

        return color;
    }, [cookies]);

    return (
        <html
            lang="en"
            {...(colorMode && {
                'data-theme': colorMode,
                style: { colorScheme: colorMode },
            })}
        >
            <head>
                <Meta />
                <title>{title}</title>
                <Links />
            </head>
            <body
                {...(colorMode && {
                    className: `chakra-ui-${colorMode}`,
                })}
            >
                <ChakraProvider theme={theme} colorModeManager={cookieStorageManagerSSR(cookies)}>
                    {children}
                </ChakraProvider>
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}

export default withEmotionCache(Document);
