import type { Database } from '$lib/application/database.types';

export type User = Database['public']['Tables']['users']['Row'];
