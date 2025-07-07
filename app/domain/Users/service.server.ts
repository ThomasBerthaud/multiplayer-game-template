import { handleResult, handleAuthResult } from '~/utils/handleResult';
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
        // User is already in the game, update their activity
        await updateUserActivity(request, gameId);
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
    
    const now = new Date().toISOString();
    // Cast to any to handle new columns that might not be in generated types yet
    const response = await (supabase
        .from('games_users') as any)
        .insert({ 
            game_id: Number(gameId), 
            user_id: user.id,
            inserted_at: now,
            last_active_at: now
        });

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
    const response = await supabase.from('users').update(form).eq('id', Number(userId));
    return handleResult(response);
}

export async function updateUserActivity(request: Request, gameId: NumberLike) {
    const user = await getCurrentUser(request);
    const supabase = getServerSupabase(request);
    
    // Cast to any to handle new column that might not be in generated types yet
    const response = await (supabase
        .from('games_users') as any)
        .update({ last_active_at: new Date().toISOString() })
        .match({ game_id: Number(gameId), user_id: user.id });
    
    return handleResult(response);
}

export async function removeInactiveUsers(request: Request, gameId?: NumberLike, inactiveMinutes: number = 15) {
    const supabase = getServerSupabase(request);
    const inactiveThreshold = new Date(Date.now() - inactiveMinutes * 60 * 1000).toISOString();
    
    let query = (supabase
        .from('games_users') as any)
        .delete()
        .lt('last_active_at', inactiveThreshold);
    
    if (gameId) {
        query = query.eq('game_id', Number(gameId));
    }
    
    const response = await query;
    return handleResult(response);
}

export async function forceRemoveUser(request: Request, gameId: NumberLike, targetUserId: number) {
    const currentUser = await getCurrentUser(request);
    const supabase = getServerSupabase(request);
    
    // Check if current user is the game owner
    const gameResponse = await supabase
        .from('games')
        .select('owner_id')
        .eq('id', Number(gameId))
        .single();
    
    const game = handleResult(gameResponse);
    
    // Get current user's UUID for comparison - use the user from getCurrentUser which already has it
    const authResponse = await supabase.auth.getUser();
    if (authResponse.error) {
        throw authResponse.error;
    }
    
    const authUser = authResponse.data.user;
    if (!authUser) {
        throw new Error('User not authenticated');
    }
    
    if (game.owner_id !== authUser.id) {
        throw new Error('Only game owner can force remove users');
    }
    
    const response = await supabase
        .from('games_users')
        .delete()
        .match({ game_id: Number(gameId), user_id: targetUserId });
    
    return handleResult(response);
}
