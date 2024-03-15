import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { parseForm } from 'react-zorm';
import { GameJoinFormSchema } from '~/domain/Games/schemas/GameJoinForm.schema';
import { authenticateUser } from '~/domain/Auth/service.server';

export async function action({ request }: ActionFunctionArgs) {
    const form = parseForm(GameJoinFormSchema, await request.formData());

    await authenticateUser(request);
    return redirect(`/games/${form.gameCode}`, { headers: request.headers });
}
