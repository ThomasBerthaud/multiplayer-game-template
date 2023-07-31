import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	create: async ({ request, locals: { gamesService, userService, getSession } }) => {
		const session = await getSession();
		if (!session) {
			throw error(401, 'not logged in');
		}

		const data = await request.formData();

		const partyName = data.get('party-name')?.toString();
		const nbPlayers = Number(data.get('nb-players'));

		if (!partyName || nbPlayers < 3 || nbPlayers > 6) {
			return fail(400, {
				wrongPartyName: !partyName,
				wrongNbPlayers: nbPlayers < 3 || nbPlayers > 6
			});
		}

		const gameResult = await gamesService.createGame({ partyName, nbPlayers });

		if (gameResult.error) {
			console.error(gameResult.error);
			return fail(500, { success: false });
		}

		const userResult = await userService.addToGame(gameResult.data.id);

		if (userResult.error) {
			console.error(userResult.error);
			return fail(500, { success: false });
		}

		throw redirect(303, `./${gameResult.data.gameCode}`);
	}
};
