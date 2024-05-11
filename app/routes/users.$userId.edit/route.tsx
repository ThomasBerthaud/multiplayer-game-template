import { requireSession } from '~/application/session.server';
import { ActionFunctionArgs, json } from '@remix-run/node';
import { parseForm } from 'react-zorm';
import invariant from 'tiny-invariant';
import { UserEditFormSchema } from '~/domain/Users/schemas/UserEditFormSchema';
import { updateUser } from '~/domain/Users/service.server';

export async function action({ params, request }: ActionFunctionArgs) {
    await requireSession(request);

    try {
        invariant(params.userId, 'userId is required');
        const form = parseForm(UserEditFormSchema, await request.formData());
        await updateUser(request, params.userId, form);
    } catch (error) {
        console.error('error while editing username', error);
        return json({ success: false, error }, { status: 400, headers: request.headers });
    }

    return json({ success: true }, { headers: request.headers });
}
