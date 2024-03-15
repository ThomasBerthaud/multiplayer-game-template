import { getServerSupabase } from '~/application/supabaseClient';
import { redirect } from '@remix-run/node';

export async function getSession(request: Request) {
    const supabase = getServerSupabase(request);

    const {
        data: { session },
    } = await supabase.auth.getSession();

    return session;
}

export async function requireSession(request: Request) {
    const session = await getSession(request);

    if (!session) {
        console.debug('No session found, redirecting to /');
        throw redirect('/');
    }
}
