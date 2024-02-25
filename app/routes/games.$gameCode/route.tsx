import Share from '~/components/Share';
import { useBlocker, useFetcher, useLoaderData, useParams } from '@remix-run/react';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { getGameLobby } from '~/domain/Games/service.server';
import { getGameId } from '~/domain/Games/gameId';
import { User } from '~/domain/Users/User.types';
import { requireSession } from '~/application/session.server';
import { getCurrentUser } from '~/domain/Auth/service.server';
import ActionButton from '~/components/ActionButton';
import { MAX_PLAYERS } from '~/domain/Games/Game.constants';
import { hasEnoughPlayers } from '~/domain/Games/Game.utils';
import { Button } from '@chakra-ui/react';

export async function loader({ params, request }: LoaderFunctionArgs) {
    invariant(params.gameCode, 'gameCode is required');
    await requireSession(request);

    const [you, game] = await Promise.all([getCurrentUser(request), getGameLobby(request, getGameId(params.gameCode))]);
    return json({ you, game }, { headers: request.headers });
}

export default function GameLobby() {
    const { you, game } = useLoaderData<typeof loader>();
    const params = useParams();
    const fetcher = useFetcher();
    invariant(params.gameCode, 'gameCode is required');
    useBlocker(() => {
        fetcher.submit({ noRedirect: true }, { action: './leave', method: 'post' });
        return false;
    });

    const onLeave = () => {
        fetcher.submit({}, { action: './leave', method: 'post' });
    };

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
                    Joueurs dans la partie ({game.users.length}/{MAX_PLAYERS})
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
                    hasEnoughPlayers(game) ? (
                        <ActionButton action="./start" label="Demarrer la partie" />
                    ) : (
                        <p>En attente de joueurs</p>
                    )
                ) : (
                    <p>En attente du lancement de la partie</p>
                )}
                <Button type="button" onClick={onLeave}>
                    Quitter la partie
                </Button>
            </footer>
        </div>
    );
}
