import { Link, useFetcher, useNavigation } from '@remix-run/react';
import { Box, Button, Container, Flex, Heading, Separator } from '@radix-ui/themes';
import JoinGameForm from '~/routes/_index/JoinGameForm';
import { GAME_NAME } from '~/domain/Games/Game.constants';
import { PlusIcon } from '@radix-ui/react-icons';

export default function Index() {
    const fetcher = useFetcher();
    const navigation = useNavigation();
    const isLoading = navigation.state === 'loading';

    const onCreateGame = () => {
        fetcher.submit({}, { action: '/games/create', method: 'post' });
    };

    return (
        <Flex direction="column" height="100vh">
            <Box width="100%" height="20vh" p="8">
                <Flex width="100%" justify="between">
                    <Heading>{GAME_NAME}</Heading>
                </Flex>
            </Box>
            <Container flexGrow="1">
                <Box minHeight="80%">
                    <Flex direction="column" width="100%" gap="4">
                        <Button type="button" onClick={onCreateGame} loading={isLoading}>
                            Créer une partie <PlusIcon />
                        </Button>
                        <JoinGameForm />
                        <Separator my="6" />
                        <Button variant="ghost" asChild>
                            <Link to="/about">À propos</Link>
                        </Button>
                    </Flex>
                </Box>
            </Container>
        </Flex>
    );
}
