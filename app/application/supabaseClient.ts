import { createBrowserClient, createServerClient, isBrowser, parse, serialize } from '@supabase/ssr';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE } from '~/utils/env';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { LoaderFunctionArgs, TypedResponse } from '@remix-run/node';
import type { Database } from '~/application/database.types';
import { useLoaderData } from '@remix-run/react';

export type AppSupabaseClient = SupabaseClient<Database>;

export function getServerSupabase(request: Request): AppSupabaseClient {
    const headers = request.headers;
    const cookies = parse(headers.get('Cookie') ?? headers.get('Set-Cookie') ?? '');

    return createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            get(key) {
                return cookies[key];
            },
            set(key, value, options) {
                headers.append('Set-Cookie', serialize(key, value, options));
            },
            remove(key, options) {
                headers.append('Set-Cookie', serialize(key, '', options));
            },
        },
    });
}

export type LoaderWithEnvs = (
    args: LoaderFunctionArgs,
) => Promise<TypedResponse<{ env: { PUBLIC_SUPABASE_URL: string; PUBLIC_SUPABASE_ANON_KEY: string } }>>;
export function useClientSupabase<T extends LoaderWithEnvs>() {
    const { env } = useLoaderData<T>();

    return createBrowserClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY);
}

export function getAdminSupabase() {
    if (isBrowser()) {
        throw new Error('supabaseAdmin is not available in browser and should NOT be used in insecure environments');
    }

    return createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
