import { getServerSupabase } from '~/application/supabaseClient';
import type { User } from '~/domain/Users/User.types';
import { getSession } from '~/application/session.server';
import { handleAuthResult, handleResult } from '~/utils/handleResult';

export async function authenticateUser(request: Request) {
    const session = await getSession(request);
    if (session) {
        console.debug('User already authenticated');
        return;
    }

    const supabase = getServerSupabase(request);
    const userName = 'Guest-' + Math.random().toString(36).substring(4, 8);
    const response = await supabase.auth.signInAnonymously({
        options: {
            data: { user_name: userName },
        },
    });

    if (response.error) {
        throw response.error;
    }
}

export async function getCurrentUser(request: Request): Promise<User> {
    const supabase = getServerSupabase(request);

    const authResponse = await supabase.auth.getUser();
    const user = handleAuthResult(authResponse);
    const userResponse = await supabase.from('users').select().eq('user_id', user.id).single();
    return handleResult(userResponse);
}
