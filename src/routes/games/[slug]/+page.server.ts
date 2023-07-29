import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals: { gamesService, userService } }) => {
	const game = await gamesService.getGame(params.slug);
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
	}
};
