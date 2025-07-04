import { handleResult } from '~/utils/handleResult';
import type { NumberLike } from '~/application/Hashid';
import { GameAlreadyStartedError } from '~/domain/Games/errors/GameAlreadyStartedError';
import { MaxPlayersError } from '~/domain/Users/errors/MaxPlayersError';
import { getGame } from '~/domain/Games/service.server';
import { getServerSupabase } from '~/application/supabaseClient';
import { getCurrentUser } from '~/domain/Auth/service.server';
import { MAX_PLAYERS } from '~/domain/Games/Game.constants';
import { GameNotFoundError } from '~/domain/Games/errors/GameNotFoundError';
import { UserEditForm } from '~/domain/Users/schemas/UserEditFormSchema';

export async function tryAddToGame(request: Request, gameId: NumberLike) {
    const user = await getCurrentUser(request);
    const supabase = getServerSupabase(request);

    const response = await supabase
        .from('games_users')
        .select()
        .eq('game_id', Number(gameId))
        .eq('user_id', user.id)
        .maybeSingle();

    if (handleResult(response) !== null) {
        return;
    }

    return await addToGame(request, gameId);
}

export async function addToGame(request: Request, gameId: NumberLike) {
    const user = await getCurrentUser(request);
    const supabase = getServerSupabase(request);

    const game = await getGame(request, gameId);
    if (!game) {
        throw new GameNotFoundError();
    }
    if (game.status !== 'pending') {
        throw new GameAlreadyStartedError();
    }
    const players = await getPlayers(request, gameId);
    if (players.length >= MAX_PLAYERS) {
        throw new MaxPlayersError();
    }
    const response = await supabase.from('games_users').insert({ game_id: Number(gameId), user_id: user.id });

    return handleResult(response);
}

export async function getPlayers(request: Request, gameId: NumberLike) {
    const supabase = getServerSupabase(request);

    const response = await supabase.from('users').select(`*, games_users!inner(*)`).eq('games_users.game_id', Number(gameId));

    return handleResult(response);
}

export async function leaveGame(request: Request, gameId: NumberLike) {
    const response = await tryLeaveGame(request, gameId);
    return handleResult(response);
}

export async function tryLeaveGame(request: Request, gameId: NumberLike) {
    const supabase = getServerSupabase(request);
    const you = await getCurrentUser(request);
    return supabase.from('games_users').delete().match({ game_id: Number(gameId), user_id: you.id });
}

export async function updateUser(request: Request, userId: string, form: UserEditForm) {
    const supabase = getServerSupabase(request);
    const response = await supabase.from('users').update(form).eq('user_id', userId);
    return handleResult(response);
}
