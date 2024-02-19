import { Form, useActionData } from '@remix-run/react';
import { action } from '~/routes/_index/route';
import { useZorm } from 'react-zorm';
import { GameJoinFormSchema } from '~/domain/Games/schemas/GameJoinForm.schema';

export default function JoinGameForm() {
    const formResponse = useActionData<typeof action>();
    const zo = useZorm('GameJoin', GameJoinFormSchema);

    return (
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
            {formResponse && <div>{formResponse.error}</div>}
        </Form>
    );
}
