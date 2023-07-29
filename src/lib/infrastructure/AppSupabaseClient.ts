import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/infrastructure/database.types';

export type AppSupabaseClient = SupabaseClient<Database>;
