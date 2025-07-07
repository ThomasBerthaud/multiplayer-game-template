import { ActionFunctionArgs, json } from '@remix-run/node';
import { authenticateUser } from '~/domain/Auth/service.server';
import { removeInactiveUsers } from '~/domain/Users/service.server';
import { getGameId } from '~/domain/Games/gameId';

export async function action({ request }: ActionFunctionArgs) {
    await authenticateUser(request);
    
    const formData = await request.formData();
    const gameCode = formData.get('gameCode') as string;
    const inactiveMinutes = Number(formData.get('inactiveMinutes') || 15);
    
    let gameId = undefined;
    if (gameCode) {
        const parsedGameId = getGameId(gameCode);
        if (parsedGameId) {
            gameId = parsedGameId;
        }
    }
    
    try {
        await removeInactiveUsers(request, gameId, inactiveMinutes);
        
        return json({ 
            success: true, 
            message: 'Inactive users removed successfully'
        });
    } catch (error) {
        return json({ 
            success: false, 
            message: 'Failed to remove inactive users',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}