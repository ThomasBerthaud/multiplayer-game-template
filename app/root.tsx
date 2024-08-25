import { json, LinksFunction, MetaFunction } from '@remix-run/node';
import { Links, Meta, Outlet, Scripts, useLoaderData } from '@remix-run/react';
import { PUBLIC_MAX_PLAYERS, PUBLIC_MIN_PLAYERS, PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '~/utils/env';
import { useClientSupabase } from '~/application/supabaseClient';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

export const links: LinksFunction = () => [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap',
    },
];

export const meta: MetaFunction = () => [
    {
        charset: 'utf-8',
        viewport: 'width=device-width,initial-scale=1',
    },
];

export async function loader() {
    return json({
        env: {
            PUBLIC_SUPABASE_URL,
            PUBLIC_SUPABASE_ANON_KEY,
            PUBLIC_MAX_PLAYERS,
            PUBLIC_MIN_PLAYERS,
        },
    });
}

export default function App() {
    const { env } = useLoaderData<typeof loader>();
    const supabase = useClientSupabase<typeof loader>();

    return (
        <html lang="fr">
            <head>
                <link rel="icon" href="data:image/x-icon;base64,AA" />
                <Meta />
                <Links />
            </head>
            <body>
                <Theme appearance="dark" accentColor="teal" grayColor="mauve">
                    <Outlet context={{ supabase }} />

                    <Scripts />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `window.env = ${JSON.stringify(env)}`,
                        }}
                    />
                </Theme>
            </body>
        </html>
    );
}
