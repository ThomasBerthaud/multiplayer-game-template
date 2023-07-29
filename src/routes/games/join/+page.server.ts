import { redirect, fail, error } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	join: async ({ request, locals: { gamesService, userService } }) => {
		const formData = await request.formData();
		const gameCode = formData.get('game-code');
		if (!gameCode) {
			return fail(400, { missingGameCode: true });
		}

		const gameResponse = await gamesService.getGame(gameCode.toString());

		if (gameResponse.error) {
			console.error(gameResponse.error);
			return fail(404, { gameNotFound: true });
		}

		const userResponse = await userService.addToGame(gameResponse.data.id);

		if (userResponse.error) {
			console.error(userResponse.error);
			throw error(500, 'something went wrong');
		}

		throw redirect(303, `/games/${gameResponse.data.gameCode}`);
	}
};
