import { requireSession } from '~/application/session.server';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { leaveGame } from '~/domain/Users/service.server';
import invariant from 'tiny-invariant';
import { getGameId } from '~/domain/Games/gameId';
import { parseForm } from 'react-zorm';
import { GameLeaveFormSchema } from '~/domain/Games/schemas/GameLeaveForm.schema';
import { deleteGameIfEmpty } from '~/domain/Games/service.server';

export async function action({ request, params }: ActionFunctionArgs) {
    invariant(params.gameCode, 'gameCode is required');

    const form = parseForm(GameLeaveFormSchema, await request.formData());

    await requireSession(request);

    const gameId = getGameId(params.gameCode);

    await leaveGame(request, gameId);

    deleteGameIfEmpty(request, gameId).catch((error) => {
        console.error('failed deleting game', error);
    });

    if (form.noRedirect) {
        return json(null);
    }

    return redirect('/', { headers: request.headers });
}
