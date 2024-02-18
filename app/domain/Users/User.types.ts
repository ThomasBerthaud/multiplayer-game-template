import type { Database } from '~/application/database.types';

export type User = Database['public']['Tables']['users']['Row'];
