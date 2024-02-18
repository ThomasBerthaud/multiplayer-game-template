import { AppSupabaseClient } from '~/application/supabaseClient';

export type RootOutletContext = {
    supabase: AppSupabaseClient;
};
