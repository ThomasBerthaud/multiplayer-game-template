import { requireSession } from '~/application/session.server';
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { leaveGame } from '~/domain/Users/service.server';
import invariant from 'tiny-invariant';
import { getGameId } from '~/domain/Games/gameId';

export async function action({ request, params }: ActionFunctionArgs) {
    invariant(params.gameCode, 'gameCode is required');

    await requireSession(request);

    const gameId = getGameId(params.gameCode);

    await leaveGame(request, gameId);

    return redirect('/', { headers: request.headers });
}
