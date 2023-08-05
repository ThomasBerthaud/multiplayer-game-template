import type { Database } from '$lib/application/database.types';

export type UserDTO = Database['public']['Tables']['users']['Row'];
