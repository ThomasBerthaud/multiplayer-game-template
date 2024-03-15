import type { PostgrestSingleResponse, User, UserResponse } from '@supabase/supabase-js';

export function handleAuthResult(response: UserResponse): User {
    if (response.error) {
        throw response.error;
    }
    return response.data.user;
}

export function handleResult<T>(response: PostgrestSingleResponse<T>): T {
    if (response.error) {
        throw response.error;
    }
    return response.data;
}
