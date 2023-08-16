import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { GameEntity } from '$lib/domain/Games';
import { AuthError } from '@supabase/supabase-js';
import { GameAlreadyStartedError, MaxPlayersError, userSsePool } from '$lib/domain/Users';

export const actions: Actions = {
	join: async ({ request, locals: { gamesService, userService } }) => {
		const formData = await request.formData();
		const gameCode = formData.get('game-code');
		if (!gameCode) {
			return fail(400, { missingGameCode: true });
		}

		const gameId = GameEntity.getGameId(gameCode.toString());
		const gameResponse = await gamesService.getGame(gameId);

		if (gameResponse.error) {
			console.error(gameResponse.error);
			return fail(404, { gameNotFound: true });
		}

		const userResponse = await userService.addToGame(gameResponse.data.id);

		if (userResponse.error) {
			console.error(userResponse.error);
			// User is not logged in
			if (userResponse.error instanceof AuthError) {
				throw redirect(300, '/');
			}
			// No more room in the game
			if (userResponse.error instanceof MaxPlayersError) {
				return fail(403, { partyIsFull: true });
			}
			// Game has already started
			if (userResponse.error instanceof GameAlreadyStartedError) {
				return fail(403, { gameAlreadyStarted: true });
			}
			// User is already in the game
			if (userResponse.error.code === '23505') {
				// ignore
			} else {
				throw error(500, 'could not join game');
			}
		}

		if (userResponse.data) {
			await userService.notifyLobbyPlayers(gameId, {
				event: 'join-lobby',
				data: { game: gameResponse.data, player: userResponse.data }
			});
		}

		throw redirect(303, `/games/${gameResponse.data.gameCode}`);
	}
};
