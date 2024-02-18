import { cssBundleHref } from '@remix-run/css-bundle';
import { json, LinksFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '~/utils/env';
import { useClientSupabase } from '~/application/supabaseClient';

export const links: LinksFunction = () => [...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : [])];

export async function loader() {
    return json({
        env: {
            PUBLIC_SUPABASE_URL,
            PUBLIC_SUPABASE_ANON_KEY,
        },
    });
}

export default function App() {
    const supabase = useClientSupabase<typeof loader>();

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
                <title></title>
            </head>
            <body>
                <Outlet context={{ supabase }} />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}
