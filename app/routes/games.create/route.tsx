import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { createGame } from '~/domain/Games/service.server';
import { getGameCode } from '~/domain/Games/gameId';
import { authenticateUser } from '~/domain/Auth/service.server';

export async function action({ request }: ActionFunctionArgs) {
    try {
        await authenticateUser(request);

        const game = await createGame(request);

        return redirect(`/games/${getGameCode(game.id)}`, { headers: request.headers });
    } catch (error) {
        console.error(error);
        return json({ error: 'Something went wrong' }, { status: 500 });
    }
}
