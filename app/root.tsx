import { json, LinksFunction, MetaFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useRouteError } from '@remix-run/react';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '~/utils/env';
import { useClientSupabase } from '~/application/supabaseClient';
import { Box, Center, ChakraProvider, ColorModeScript, Heading, HStack, VStack } from '@chakra-ui/react';
import { parseErrorMessage, parseErrorStatus, parseErrorStatusText } from '~/application/ApiError';
import { WarningTwoIcon } from '@chakra-ui/icons';

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
        },
    });
}

function Document({ children, title = 'App title' }: { children: React.ReactNode; title?: string }) {
    return (
        <html lang="en">
            <head>
                <Meta />
                <title>{title}</title>
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}

export default function App() {
    const supabase = useClientSupabase<typeof loader>();

    return (
        <Document>
            <ColorModeScript />
            <ChakraProvider>
                <Outlet context={{ supabase }} />
            </ChakraProvider>
        </Document>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();

    return (
        <Document title="Error!">
            <ChakraProvider>
                <VStack spacing={8}>
                    <Box w="100%" bg="purple.400">
                        <Center>
                            <HStack py={10} px={2} color="white">
                                <WarningTwoIcon boxSize={6} />
                                <Heading as="h1">{parseErrorStatus(error)}</Heading>
                                <Heading as="h1"> - </Heading>
                                <Heading as="h1">{parseErrorStatusText(error)}</Heading>
                                <WarningTwoIcon boxSize={6} />
                            </HStack>
                        </Center>
                    </Box>
                    <Heading as="h1">{parseErrorMessage(error)}</Heading>
                </VStack>
            </ChakraProvider>
        </Document>
    );
}
