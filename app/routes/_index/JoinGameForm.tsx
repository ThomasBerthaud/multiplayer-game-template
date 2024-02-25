import { useActionData, useFetcher } from '@remix-run/react';
import { action } from '~/routes/games.join/route';
import { useZorm } from 'react-zorm';
import { GameJoinFormSchema } from '~/domain/Games/schemas/GameJoinForm.schema';

export default function JoinGameForm() {
    const fetcher = useFetcher();
    const formResponse = useActionData<typeof action>();
    const zo = useZorm('GameJoin', GameJoinFormSchema);

    return (
        <fetcher.Form ref={zo.ref} method="post" action="/games/join">
            <label htmlFor={zo.fields.gameCode()} className="label">
                <span>Identifiant de la partie</span>
                <input className="input" type="text" id="game-code" name={zo.fields.gameCode()} />
            </label>
            <div className="text-center">
                <button type="submit" className="btn btn-xl variant-filled-primary my-2">
                    Rejoindre
                </button>
            </div>
            {formResponse && <div>{formResponse.error}</div>}
        </fetcher.Form>
    );
}
