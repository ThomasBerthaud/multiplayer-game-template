import Alert from '~/components/Alert';
import { Form, useActionData } from '@remix-run/react';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { parseForm, useValue, useZorm } from 'react-zorm';
import { MAX_NB_PLAYERS, MIN_NB_PLAYERS, NewGameFormSchema } from '~/domain/Games/schemas/NewGameForm.schema';
import { createGame } from '~/domain/Games/service.server';
import { getGameCode } from '~/domain/Games/gameId';
import { authenticateUser } from '~/domain/Auth/service.server';
import { addToGame } from '~/domain/Users/service.server';

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
    const formResponse = useActionData<typeof action>();
    const zo = useZorm('NewGame', NewGameFormSchema);
    const nbPlayers = useValue({ zorm: zo, name: zo.fields.nbPlayers(), initialValue: 3 });
    console.log(nbPlayers);

    return (
        <div className="card p-4">
            <h3 className="h3 mb-4">Créer une nouvelle partie</h3>
            <Form ref={zo.ref} method="POST">
                <label htmlFor={zo.fields.partyName()} className="label my-2">
                    <span>Nom de la salle</span>
                    <input
                        className={[zo.errors.partyName('errored')].join(' ')}
                        id="party-name"
                        type="text"
                        name={zo.fields.partyName()}
                    />
                    {zo.errors.partyName((error) => (
                        <Alert title={error.message} />
                    ))}
                </label>
                <label htmlFor={zo.fields.nbPlayers()} className="label my-2">
                    <span>Nombre de joueurs (3 à 6)</span>
                    <input
                        className={[zo.errors.partyName('errored')].join(' ')}
                        type="range"
                        min={MIN_NB_PLAYERS}
                        max={MAX_NB_PLAYERS}
                        step={1}
                        name={zo.fields.nbPlayers()}
                    />
                    <span>{nbPlayers}</span>
                    {zo.errors.nbPlayers((error) => (
                        <Alert title="Error with number players" message={error.message} />
                    ))}
                </label>
                <div className="text-center">
                    <button type="submit" className="btn btn-xl variant-filled-primary my-2">
                        Créer
                    </button>
                </div>
                {formResponse?.error && <Alert title="Error while creating game" message={formResponse.error} />}
            </Form>
        </div>
    );
}
