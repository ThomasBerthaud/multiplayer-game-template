import { handleResult } from '~/utils/handleResult';
import type { NumberLike } from '~/application/Hashid';
import { GameAlreadyStartedError } from '~/domain/Users/errors/GameAlreadyStartedError';
import { MaxPlayersError } from '~/domain/Users/errors/MaxPlayersError';
import { getGame } from '~/domain/Games/service.server';
import { getServerSupabase } from '~/application/supabaseClient';
import { getCurrentUser } from '~/domain/Auth/service.server';

export async function addToGame(request: Request, gameId: NumberLike) {
    const user = await getCurrentUser(request);
    const supabase = getServerSupabase(request);

    const game = await getGame(request, gameId);
    if (game.status !== 'pending') {
        throw new GameAlreadyStartedError();
    }
    const players = await getPlayers(request, gameId);
    if (players.length >= game.total_players) {
        throw new MaxPlayersError();
    }
    const response = await supabase.from('games_users').insert({ game_id: gameId, user_id: user.id });

    return handleResult(response);
}

export async function getPlayers(request: Request, gameId: NumberLike) {
    const supabase = getServerSupabase(request);

    const response = await supabase.from('users').select(`*, games_users!inner(*)`).eq('games_users.game_id', gameId);

    return handleResult(response);
}

export async function leaveGame(request: Request) {
    const response = await tryLeaveGame(request);
    return handleResult(response);
}

export async function tryLeaveGame(request: Request) {
    const supabase = getServerSupabase(request);
    const you = await getCurrentUser(request);
    return supabase.from('users').select('*').eq('id', you.id);
}
