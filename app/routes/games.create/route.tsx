import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { parseForm } from 'react-zorm';
import { NewGameFormSchema } from '~/domain/Games/schemas/NewGameForm.schema';
import { createGame } from '~/domain/Games/service.server';
import { getGameCode } from '~/domain/Games/gameId';
import { authenticateUser } from '~/domain/Auth/service.server';
import { addToGame } from '~/domain/Users/service.server';
import CreateGameForm from '~/routes/games.create/CreateGameForm';

export async function action({ request }: ActionFunctionArgs) {
    try {
        const form = parseForm(NewGameFormSchema, await request.formData());
        await authenticateUser(request);
        const game = await createGame(request, form);
        await addToGame(request, game.id);

        return redirect(`/games/${getGameCode(game.id)}`, { headers: request.headers });
    } catch (error) {
        console.error(error);
        return json({ error: 'Something went wrong' }, { status: 500 });
    }
}

export default function GameCreate() {
    return (
        <div className="card p-4">
            <h3 className="h3 mb-4">Créer une nouvelle partie</h3>
            <CreateGameForm />
        </div>
    );
}
