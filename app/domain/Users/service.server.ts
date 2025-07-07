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

/**
 * Handles a user leaving a game with automatic ownership transfer.
 * 
 * When the current owner leaves:
 * - Ownership is transferred to the oldest remaining member (by inserted_at timestamp)
 * - If no members remain, the game will be cleaned up by deleteGameIfEmpty()
 * 
 * @param request - The request object for authentication
 * @param gameId - The ID of the game to leave
 * @returns Promise resolving to the delete response
 */
export async function tryLeaveGame(request: Request, gameId: NumberLike) {
    const supabase = getServerSupabase(request);
    const you = await getCurrentUser(request);
    
    // Check if the leaving user is the owner of the game
    const game = await getGame(request, gameId);
    if (!game) {
        throw new GameNotFoundError();
    }
    
    const isOwner = game.owner_id === you.user_id;
    
    // Remove the user from the game
    const deleteResponse = await supabase.from('games_users').delete().match({ game_id: Number(gameId), user_id: you.id });
    
    // If the leaving user was the owner, transfer ownership
    if (isOwner) {
        await transferOwnership(request, gameId);
    }
    
    return deleteResponse;
}

export async function updateUser(request: Request, userId: string, form: UserEditForm) {
    const supabase = getServerSupabase(request);
    const response = await supabase.from('users').update(form).eq('id', Number(userId));
    return handleResult(response);
}

/**
 * Transfers ownership of a game to the oldest remaining member.
 * 
 * Finds the user who joined the game earliest (by inserted_at timestamp)
 * and updates the game's owner_id to their user_id.
 * 
 * If no users remain in the game, no action is taken as deleteGameIfEmpty()
 * will handle the cleanup of empty games.
 * 
 * @param request - The request object for database access
 * @param gameId - The ID of the game to transfer ownership for
 */
async function transferOwnership(request: Request, gameId: NumberLike) {
    const supabase = getServerSupabase(request);
    
    // Get remaining users in the game, ordered by inserted_at ASC (oldest first)
    const remainingUsersResponse = await supabase
        .from('users')
        .select('user_id, inserted_at, games_users!inner(*)')
        .eq('games_users.game_id', Number(gameId))
        .order('inserted_at', { ascending: true })
        .limit(1)
        .maybeSingle();
    
    const oldestUser = handleResult(remainingUsersResponse);
    
    // Transfer ownership to the oldest remaining user if any exist
    // If no users remain, deleteGameIfEmpty will handle cleanup
    if (oldestUser) {
        await supabase
            .from('games')
            .update({ owner_id: oldestUser.user_id })
            .eq('id', Number(gameId));
    }
}
