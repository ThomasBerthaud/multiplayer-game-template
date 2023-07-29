import { fail } from '@sveltejs/kit';
import type { Actions, LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getSession } }) => {
	const session = await getSession();
	if (!session) {
		return {};
	}

	return {
		user: session.user
	};
};

export const actions: Actions = {
	login: async ({ request, cookies, locals }) => {
		const data = await request.formData();

		const userName = data.get('user-name');

		if (!userName) {
			return fail(400, { missingUserName: true });
		}

		const userId = cookies.get('uuid');
		const response = await locals.authService.authenticateUser(userId, userName.toString());

		if (response.error) {
			console.error(response.error);
			return fail(400, { unknownError: true });
		}

		cookies.set('uuid', response.data.userId);
	}
};
