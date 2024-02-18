import { Form } from '@remix-run/react';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { authenticateUser } from '~/domain/Auth/service.server';
import { addToGame, tryLeaveGame } from '~/domain/Users/service.server';
import { parseForm, useZorm } from 'react-zorm';
import { GameJoinFormSchema } from '~/domain/Games/schemas/GameJoinForm.schema';
import { getGameId } from '~/domain/Games/gameId';

export async function action({ request }: ActionFunctionArgs) {
    try {
        const form = parseForm(GameJoinFormSchema, await request.formData());

        await authenticateUser(request);

        await addToGame(request, getGameId(form.gameCode));

        return redirect(`/games/${form.gameCode}`, { headers: request.headers });
    } catch (error) {
        console.error(error);
        await tryLeaveGame(request);
        return json({ error: 'could not join game' }, { status: 500 });
    }
}

export default function GameJoin() {
    const zo = useZorm('GameJoin', GameJoinFormSchema);

    return (
        <div className="card p-4">
            <Form ref={zo.ref} method="post">
                <label htmlFor={zo.fields.gameCode()} className="label">
                    <span>Identifiant de la partie</span>
                    <input className="input" type="text" id="game-code" name={zo.fields.gameCode()} />
                </label>
                <div className="text-center">
                    <button type="submit" className="btn btn-xl variant-filled-primary my-2">
                        Rejoindre
                    </button>
                </div>
            </Form>
        </div>
    );
}
