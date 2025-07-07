import { getServerSupabase } from '~/application/supabaseClient';
import { Game } from '~/domain/Games/Game.types';
import { handleResult } from '~/utils/handleResult';
import { NumberLike } from 'hashids/util';

export async function getGame(request: Request, gameId: NumberLike): Promise<Game | null> {
    const supabase = getServerSupabase(request);
    const response = await supabase.from('games').select().match({ id: gameId }).maybeSingle();
    return handleResult(response);
}

export async function getGameLobby(request: Request, gameId: NumberLike) {
    const supabase = getServerSupabase(request);
    const gameResponse = await supabase
        .from('games')
        .select('*, users!games_users(*)')
        .match({ id: gameId })
        .single();
    
    const game = handleResult(gameResponse);
    
    // Sort users by their arrival time in the game (games_users.inserted_at)
    if (game && game.users) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- New columns not in generated types yet
            const usersWithJoinTime = await (supabase
                .from('games_users') as any)
                .select('user_id, inserted_at, last_active_at')
                .eq('game_id', Number(gameId))
                .order('inserted_at', { ascending: true });
            
            const joinTimeData = handleResult(usersWithJoinTime) as Array<{
                user_id: number;
                inserted_at: string;
                last_active_at: string;
            }>;
            
            const joinTimeMap = new Map(
                joinTimeData.map((gu) => [gu.user_id, gu])
            );
            
            // Sort users array by their join time
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- User types from Supabase
            game.users.sort((a: any, b: any) => {
                const joinTimeA = joinTimeMap.get(a.id)?.inserted_at;
                const joinTimeB = joinTimeMap.get(b.id)?.inserted_at;
                if (!joinTimeA || !joinTimeB) return 0;
                return new Date(joinTimeA).getTime() - new Date(joinTimeB).getTime();
            });
        } catch (error) {
            // If sorting fails (e.g., migration not run yet), just return unsorted
            console.warn('Failed to sort users by join time:', error);
        }
    }
    
    return game;
}

export async function createGame(request: Request) {
    const supabase = getServerSupabase(request);
    const response = await supabase.from('games').insert({}).select().single();
    return handleResult(response);
}

export async function deleteGameIfEmpty(request: Request, gameId: NumberLike) {
    const supabase = getServerSupabase(request);
    const usersGameResponse = await supabase.from('games_users').select().eq('game_id', Number(gameId)).maybeSingle();
    const hasUsers = handleResult(usersGameResponse) !== null;
    if (hasUsers) {
        return;
    }
    const deleteResponse = await supabase.from('games').delete().match({ id: gameId });
    return handleResult(deleteResponse);
}
