import { Link, useNavigation } from '@remix-run/react';
import { AbsoluteCenter, Box, Button, Card, Divider, Heading, VStack } from '@chakra-ui/react';
import { parseForm } from 'react-zorm';
import { GameJoinFormSchema } from '~/domain/Games/schemas/GameJoinForm.schema';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { authenticateUser } from '~/domain/Auth/service.server';
import { addToGame, tryLeaveGame } from '~/domain/Users/service.server';
import { getGameId } from '~/domain/Games/gameId';
import { getApiErrorMessage } from '~/application/ApiError';
import JoinGameForm from '~/routes/_index/JoinGameForm';
import { NumberLike } from '~/application/Hashid';

export async function action({ request }: ActionFunctionArgs) {
    let gameId: NumberLike | undefined = undefined;
    try {
        const form = parseForm(GameJoinFormSchema, await request.formData());
        gameId = getGameId(form.gameCode);

        await authenticateUser(request);
        await addToGame(request, gameId);

        return redirect(`/games/${form.gameCode}`, { headers: request.headers });
    } catch (error) {
        console.error(error);
        if (gameId !== undefined) {
            await tryLeaveGame(request, gameId);
        }
        return json({ error: getApiErrorMessage(error) }, { status: 400 });
    }
}

export default function Index() {
    const navigation = useNavigation();
    const isLoading = navigation.state === 'loading';

    return (
        <VStack spacing={6}>
            <Box w="100%" p={8} bgColor="purple.400">
                <Heading textAlign="center">Bienvenue</Heading>
            </Box>
            <Card w="60%" alignItems="center" py={4} px={6}>
                <VStack w="100%" spacing={4}>
                    <Link to="/games/create">
                        <Button colorScheme="purple" fontSize="lg" isLoading={isLoading}>
                            Jouer
                        </Button>
                    </Link>
                    <Box w="100%" my={5}>
                        <Divider w="100%" />
                        <AbsoluteCenter bg="white" px="4">
                            OU
                        </AbsoluteCenter>
                    </Box>
                    <JoinGameForm />
                </VStack>
            </Card>
        </VStack>
    );
}
