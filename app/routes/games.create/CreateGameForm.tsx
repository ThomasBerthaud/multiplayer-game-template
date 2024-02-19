import AppAlert from '~/components/AppAlert';
import { MAX_NB_PLAYERS, MIN_NB_PLAYERS, NewGameFormSchema } from '~/domain/Games/schemas/NewGameForm.schema';
import { Form, useActionData } from '@remix-run/react';
import { useValue, useZorm } from 'react-zorm';
import { action } from '~/routes/games.create/route';

export default function CreateGameForm() {
    const formResponse = useActionData<typeof action>();
    const zo = useZorm('NewGame', NewGameFormSchema);
    const nbPlayers = useValue({ zorm: zo, name: zo.fields.nbPlayers(), initialValue: 3 });

    return (
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
                    <AppAlert title={error.message} />
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
                    <AppAlert title="Error with number players" message={error.message} />
                ))}
            </label>
            <div className="text-center">
                <button type="submit" className="btn btn-xl variant-filled-primary my-2">
                    Créer
                </button>
            </div>
            {formResponse?.error && <AppAlert title="Error while creating game" message={formResponse.error} />}
        </Form>
    );
}
