import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { NumberLike } from '~/application/Hashid';
import { parseForm } from 'react-zorm';
import { GameJoinFormSchema } from '~/domain/Games/schemas/GameJoinForm.schema';
import { getGameId } from '~/domain/Games/gameId';
import { authenticateUser } from '~/domain/Auth/service.server';
import { addToGame, tryLeaveGame } from '~/domain/Users/service.server';
import { getApiErrorMessage } from '~/application/ApiError';

export async function action({ request }: ActionFunctionArgs) {
    let gameId: NumberLike | undefined = undefined;
    try {
        const form = parseForm(GameJoinFormSchema, await request.formData());
        gameId = getGameId(form.gameCode);

        await authenticateUser(request);
        await addToGame(request, gameId);

        return redirect(`/games/${form.gameCode}`, { headers: request.headers });
    } catch (error) {
        console.error(error);
        if (gameId !== undefined) {
            await tryLeaveGame(request, gameId);
        }
        return json({ error: getApiErrorMessage(error) }, { status: 400 });
    }
}
