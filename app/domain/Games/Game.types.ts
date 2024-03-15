import type { Database } from '~/application/database.types';

export type Game = Database['public']['Tables']['games']['Row'];

export type GameStatus = Database['public']['Enums']['game_status'];
