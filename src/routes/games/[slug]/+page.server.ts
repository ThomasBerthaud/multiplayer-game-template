import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { GameEntity } from '$lib/domain/Games/GameEntity';
import { MaxPlayersError } from '$lib/domain/Users/errors/MaxPlayersError';
import { GameAlreadyStartedError } from '$lib/domain/Users/errors/GameAlreadyStartedError';

export const load: PageServerLoad = async ({
	params,
	locals: { supabase, gamesService, userService }
}) => {
	const gameId = GameEntity.getGameId(params.slug);
	const game = await gamesService.getGame(gameId);
	if (game.error) {
		console.error(game.error);
		error(404, 'game not found');
	}
	const players = await userService.getPlayers(game.data.id);
	if (players.error) {
		console.error(game.error);
		error(404, 'game not found');
	}

	const roomOne = supabase.channel('room-1');
	roomOne.subscribe();

	const partyChannel = supabase
		.channel('schema-db-changes')
		.on(
			'postgres_changes',
			{
				event: '*',
				schema: 'public',
				table: 'games_users'
			},
			async (payload) => {
				try {
					console.log(payload);
					const userId = payload.eventType === 'DELETE' ? payload.old.user_id : payload.new.user_id;
					const userResponse = await supabase.from('users').select().match({ id: userId }).single();
					roomOne.send({
						type: 'broadcast',
						event: 'test',
						payload: { user: userResponse.data, eventType: payload.eventType }
					});
				} catch (e) {
					console.error(e);
				}
			}
		)
		.subscribe();

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
		const gameId = GameEntity.getGameId(params.slug);
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
			error(404, "couldn't join game");
		}
	},
	leave: async ({ params, locals: { userService } }) => {
		const gameId = GameEntity.getGameId(params.slug);
		await userService.leaveGame(gameId);
		redirect(303, '/');
	}
};
