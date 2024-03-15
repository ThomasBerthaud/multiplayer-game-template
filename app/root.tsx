import { json, LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { PUBLIC_MAX_PLAYERS, PUBLIC_MIN_PLAYERS, PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '~/utils/env';
import { useClientSupabase } from '~/application/supabaseClient';
import Document from '~/components/Document';

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

export async function loader({ request }: LoaderFunctionArgs) {
    return json({
        env: {
            PUBLIC_SUPABASE_URL,
            PUBLIC_SUPABASE_ANON_KEY,
            PUBLIC_MAX_PLAYERS,
            PUBLIC_MIN_PLAYERS,
        },
        cookies: request.headers.get('cookie') ?? '',
    });
}

export default function App() {
    const { env, cookies } = useLoaderData<typeof loader>();
    const supabase = useClientSupabase<typeof loader>();

    return (
        <Document cookies={cookies}>
            <Outlet context={{ supabase }} />
            <script
                dangerouslySetInnerHTML={{
                    __html: `window.env = ${JSON.stringify(env)}`,
                }}
            />
        </Document>
    );
}
