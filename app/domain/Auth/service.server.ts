import { v4 as uuid } from 'uuid';
import type { SignInWithPasswordCredentials } from '@supabase/gotrue-js/src/lib/types';
import { DEFAULT_USER_PASSWORD, EMAIL_DOMAIN } from '~/utils/env';
import { getAdminSupabase, getServerSupabase } from '~/application/supabaseClient';
import type { User } from '~/domain/Users/User.types';
import { getSession } from '~/application/session.server';
import { handleAuthResult, handleResult } from '~/utils/handleResult';

function getCredentials(userId: string): SignInWithPasswordCredentials {
    return {
        email: `${userId}${EMAIL_DOMAIN}`,
        password: DEFAULT_USER_PASSWORD,
    };
}

export async function authenticateUser(request: Request) {
    const session = await getSession(request);
    if (session) {
        console.debug('User already authenticated');
        return;
    }

    const userId = uuid();
    const userName = 'Guest' + Math.random().toString(36).substring(4);
    const adminSupabase = getAdminSupabase();
    const credentials = getCredentials(userId);
    const createResponse = await adminSupabase.auth.admin.createUser({
        ...credentials,
        email_confirm: true,
        user_metadata: {
            user_name: userName,
        },
    });

    if (createResponse.error) {
        throw createResponse.error;
    }

    const supabase = getServerSupabase(request);
    const response = await supabase.auth.signInWithPassword(credentials);

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
