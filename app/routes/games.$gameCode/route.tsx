import Share from '~/components/Share';
import { Link, useLoaderData, useParams } from '@remix-run/react';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { getGameLobby } from '~/domain/Games/service.server';
import { getGameId } from '~/domain/Games/gameId';
import { User } from '~/domain/Users/User.types';
import { requireSession } from '~/application/session.server';
import { getCurrentUser } from '~/domain/Auth/service.server';
import ActionButton from '~/components/ActionButton';

export async function loader({ params, request }: LoaderFunctionArgs) {
    invariant(params.gameCode, 'gameCode is required');
    await requireSession(request);

    const [you, game] = await Promise.all([getCurrentUser(request), getGameLobby(request, getGameId(params.gameCode))]);
    return json({ you, game }, { headers: request.headers });
}

export default function GameLobby() {
    const { you, game } = useLoaderData<typeof loader>();
    const params = useParams();
    invariant(params.gameCode, 'gameCode is required');
    const isOwner = you.user_id === game.owner_id;

    const isYou = (player: User) => player.id === you.id;

    return (
        <div className="card">
            <header className="card-header flex items-center justify-between gap-5">
                <h1 className="h1">Partie n° {params.gameCode}</h1>
                <Share content={params.gameCode} />
            </header>
            <section className="p-4">
                <h3>
                    Joueurs dans la partie ({game.users.length}/{game.total_players})
                </h3>
                <ul>
                    {game.users.map((user: User) => (
                        <li key={user.id}>
                            {user.user_name} {isYou(user) && <span>(You)</span>}
                        </li>
                    ))}
                </ul>
            </section>
            <hr className="opacity-50 mb-4" />
            <footer className="card-footer flex gap-3">
                {isOwner ? (
                    <ActionButton action="./start" label="Demarrer la partie" />
                ) : (
                    <p>En attente du lancement de la partie</p>
                )}
                <Link to="/">Quitter la partie</Link>
            </footer>
        </div>
    );
}
