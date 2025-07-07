import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { authenticateUser } from '~/domain/Auth/service.server';
import { forceRemoveUser } from '~/domain/Users/service.server';
import { getGameId } from '~/domain/Games/gameId';
import invariant from 'tiny-invariant';

export async function action({ request, params }: ActionFunctionArgs) {
    invariant(params.gameCode, 'gameCode is required');
    await authenticateUser(request);
    
    const gameId = getGameId(params.gameCode);
    if (!gameId) {
        throw new Error('Invalid game code');
    }
    
    const formData = await request.formData();
    const targetUserId = Number(formData.get('targetUserId'));
    
    if (!targetUserId) {
        throw new Error('Target user ID is required');
    }
    
    await forceRemoveUser(request, gameId, targetUserId);
    
    return redirect(`/games/${params.gameCode}`);
}