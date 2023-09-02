import type { Database } from '$lib/application/database.types';

export type GameDTO = Database['public']['Tables']['games']['Row'];

export type GameStatusDTO = Database['public']['Enums']['game_status'];