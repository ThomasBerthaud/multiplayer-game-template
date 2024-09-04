import { Button, Card, Flex, Heading, Text, Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { json, LinksFunction, MetaFunction } from '@remix-run/node';
import { Link, Links, Meta, Outlet, Scripts, useLoaderData } from '@remix-run/react';
import { useClientSupabase } from '~/application/supabaseClient';
import { PUBLIC_MAX_PLAYERS, PUBLIC_MIN_PLAYERS, PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '~/utils/env';

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
    },
    {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
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
        <html lang="fr" style={{ width: '100%', height: '100%' }}>
            <head>
                <link rel="icon" href="data:image/x-icon;base64,AA" />
                <Meta />
                <Links />
                <style>{`
                    html, body {
                        width: 100%;
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        overflow-x: hidden;
                    }
                    #root {
                        width: 100%;
                        height: 100%;
                    }
                `}</style>
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

export function ErrorBoundary() {
    return (
        <html lang="fr">
            <head>
                <title>Oh no!</title>
                <Meta />
                <Links />
            </head>
            <body>
                <Theme appearance="dark" accentColor="teal" grayColor="mauve">
                    <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        style={{ minHeight: '100vh', padding: '24px' }}
                    >
                        <Card size="3">
                            <Flex direction="column" align="center" gap="4">
                                <Heading size="6" align="center">
                                    Une erreur est survenue
                                </Heading>
                                <Text size="2" align="center">
                                    Désolé, quelque chose s&apos;est mal passé. Veuillez réessayer plus tard.
                                </Text>

                                <Button asChild>
                                    <Link to="/">Retour à l&apos;accueil</Link>
                                </Button>
                            </Flex>
                        </Card>
                    </Flex>
                </Theme>
                <Scripts />
            </body>
        </html>
    );
}
