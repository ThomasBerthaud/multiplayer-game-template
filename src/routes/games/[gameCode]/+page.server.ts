import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { GameEntity } from '$lib/domain/Games';
import { GameAlreadyStartedError, MaxPlayersError, userSsePool } from '$lib/domain/Users';

export const load: PageServerLoad = async ({ params, locals: { gamesService, userService } }) => {
	const gameId = GameEntity.getGameId(params.gameCode);
	const game = await gamesService.getGame(gameId);
	if (game.error) {
		console.error(game.error);
		throw error(404, 'game not found');
	}
	const players = await userService.getPlayers(game.data.id);
	if (players.error) {
		console.error(game.error);
		throw error(404, 'game not found');
	}

	return {
		game: game.data.toJSON(),
		players: players.data.map((e) => e.toJSON())
	};
};

export const actions: Actions = {
	start: async () => {
		console.log('TODO start game');
	},
	join: async ({ params, locals: { gamesService, userService } }) => {
		const gameId = GameEntity.getGameId(params.gameCode);
		const gameResponse = await gamesService.getGame(gameId);

		if (gameResponse.error) {
			console.error(gameResponse.error);
			return fail(404, { gameNotFound: true });
		}

		const userResponse = await userService.addToGame(gameResponse.data.id);

		if (userResponse.error) {
			console.error(userResponse.error);
			if (userResponse.error instanceof MaxPlayersError) {
				return fail(403, { partyIsFull: true });
			}
			if (userResponse.error instanceof GameAlreadyStartedError) {
				return fail(403, { gameAlreadyStarted: true });
			}
			throw error(404, "couldn't join game");
		}

		await userService.notifyLobbyPlayers(gameResponse.data.id, {
			event: 'join-lobby',
			data: { game: gameResponse.data, player: userResponse.data }
		});
	},
	leave: async ({ params, locals: { userService } }) => {
		const gameId = GameEntity.getGameId(params.gameCode);
		const userResponse = await userService.leaveGame(gameId);

		// TODO should not be manual. Use supabase realtime instead
		if (!userResponse.error) {
			await userService.notifyLobbyPlayers(gameId, {
				event: 'leave-lobby',
				data: { player: userResponse.data }
			});
		}
		throw redirect(303, '/');
	}
};
