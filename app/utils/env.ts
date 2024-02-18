import { isBrowser } from '@supabase/ssr';

declare global {
    interface Window {
        env: {
            PUBLIC_SUPABASE_URL: string;
            PUBLIC_SUPABASE_ANON_KEY: string;
        };
    }
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface ProcessEnv {
            PUBLIC_SUPABASE_URL: string;
            PUBLIC_SUPABASE_ANON_KEY: string;
            SUPABASE_SERVICE_ROLE: string;
            HASH_SALT: string;
            DEFAULT_USER_PASSWORD: string;
            DOMAIN_NAME: string;
        }
    }
}

type EnvOptions = {
    isSecret?: boolean;
    isRequired?: boolean;
};
function getEnv(name: string, { isRequired, isSecret }: EnvOptions = { isSecret: true, isRequired: true }) {
    if (isBrowser() && isSecret) return '';

    const source = (isBrowser() ? window.env : process.env) ?? {};

    const value = source[name as keyof typeof source] || '';

    if (!value && isRequired) {
        throw new Error(`Env "${name}" is not set`);
    }

    return value;
}

/**
 * Server env
 */
export const SUPABASE_SERVICE_ROLE = getEnv('SUPABASE_SERVICE_ROLE');
export const HASH_SALT = getEnv('HASH_SALT');
export const DEFAULT_USER_PASSWORD = getEnv('DEFAULT_USER_PASSWORD');
export const EMAIL_DOMAIN = getEnv('EMAIL_DOMAIN');

/**
 * Shared env
 */
export const PUBLIC_SUPABASE_URL = getEnv('PUBLIC_SUPABASE_URL', { isSecret: false });
export const PUBLIC_SUPABASE_ANON_KEY = getEnv('PUBLIC_SUPABASE_ANON_KEY', {
    isSecret: false,
});
