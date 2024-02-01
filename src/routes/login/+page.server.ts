import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	login: async ({ request, cookies, locals: { authService } }) => {
		const data = await request.formData();

		const userName = data.get('user-name');

		if (!userName) {
			return fail(400, { missingUserName: true });
		}

		const userId = cookies.get('uuid');
		const response = await authService.authenticateUser(userId, userName.toString());

		if (response.error) {
			console.error(response.error);
			return fail(400, { unknownError: true });
		}

		cookies.set('uuid', response.data.userId, { path: '/' });
		redirect(303, '/');
	}
};
