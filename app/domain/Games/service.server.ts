import { NewGameForm } from '~/domain/Games/schemas/NewGameForm.schema';
import { getServerSupabase } from '~/application/supabaseClient';
import { Game } from '~/domain/Games/Game.types';
import { handleResult } from '~/utils/handleResult';
import { NumberLike } from 'hashids/util';

export async function getGame(request: Request, gameId: NumberLike): Promise<Game> {
    const supabase = getServerSupabase(request);
    const response = await supabase.from('games').select().match({ id: gameId }).single();
    return handleResult(response);
}

export async function getGameLobby(request: Request, gameId: NumberLike) {
    const supabase = getServerSupabase(request);
    const gameResponse = await supabase.from('games').select('*, users!games_users(*)').match({ id: gameId }).single();
    return handleResult(gameResponse);
}

export async function createGame(request: Request, newGame: NewGameForm) {
    const supabase = getServerSupabase(request);

    const response = await supabase
        .from('games')
        .insert({ party_name: newGame.partyName, total_players: newGame.nbPlayers })
        .select()
        .single();

    return handleResult(response);
}
