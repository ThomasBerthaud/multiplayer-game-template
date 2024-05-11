import Share from '~/components/Share';
import { useBlocker, useFetcher, useLoaderData, useParams } from '@remix-run/react';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { getGame, getGameLobby } from '~/domain/Games/service.server';
import { getGameId } from '~/domain/Games/gameId';
import { User } from '~/domain/Users/User.types';
import { authenticateUser, getCurrentUser } from '~/domain/Auth/service.server';
import ActionButton from '~/components/ActionButton';
import { GAME_NAME, MAX_PLAYERS } from '~/domain/Games/Game.constants';
import { hasEnoughPlayers } from '~/domain/Games/Game.utils';
import {
    Box,
    Center,
    CircularProgress,
    CircularProgressLabel,
    Container,
    Divider,
    Heading,
    HStack,
    IconButton,
    List,
    ListItem,
    Text,
} from '@chakra-ui/react';
import { tryAddToGame } from '~/domain/Users/service.server';
import { GameNotFoundError } from '~/domain/Games/errors/GameNotFoundError';
import Player from './player/Player';
import { ArrowBackIcon } from '@chakra-ui/icons';

export async function loader({ params, request }: LoaderFunctionArgs) {
    invariant(params.gameCode, 'gameCode is required');
    await authenticateUser(request);
    const gameId = getGameId(params.gameCode);

    if (!gameId) {
        throw new GameNotFoundError();
    }

    const game = await getGame(request, gameId);
    if (!game) {
        throw new GameNotFoundError();
    }

    await tryAddToGame(request, gameId);

    const [you, gameLobby] = await Promise.all([getCurrentUser(request), getGameLobby(request, gameId)]);
    return json({ you, gameLobby }, { headers: request.headers });
}

export default function GameLobby() {
    const { you, gameLobby } = useLoaderData<typeof loader>();
    const params = useParams();
    const fetcher = useFetcher();
    invariant(params.gameCode, 'gameCode is required');
    useBlocker(() => {
        onLeave({ noRedirect: true });
        return false;
    });

    const onLeave = (target = {}) => {
        fetcher.submit(target, { action: './leave', method: 'post' });
    };

    const isOwner = you.user_id === gameLobby.owner_id;

    return (
        <Container py={10}>
            <HStack spacing={6}>
                <IconButton icon={<ArrowBackIcon />} aria-label="Quitter la partie" onClick={onLeave} />
                <Heading>{GAME_NAME}</Heading>
            </HStack>
            <Box pt={10}>
                <HStack justifyContent="space-between" pb={4}>
                    <HStack>
                        <Heading as="h3" size="lg">
                            Joueurs
                        </Heading>
                        <CircularProgress value={(gameLobby.users.length / MAX_PLAYERS) * 100} thickness="5px">
                            <CircularProgressLabel>
                                {gameLobby.users.length} / {MAX_PLAYERS}
                            </CircularProgressLabel>
                        </CircularProgress>
                    </HStack>
                    <Share />
                </HStack>

                <List spacing={3}>
                    {gameLobby.users.map((user: User) => (
                        <ListItem key={user.id}>
                            <Player user={user} />
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Divider my={8} />
            <Center>
                {isOwner ? (
                    hasEnoughPlayers(gameLobby) ? (
                        <ActionButton action="./start" label="Demarrer la partie" />
                    ) : (
                        <Text>En attente de joueurs</Text>
                    )
                ) : (
                    <Text>En attente du lancement de la partie</Text>
                )}
            </Center>
        </Container>
    );
}
