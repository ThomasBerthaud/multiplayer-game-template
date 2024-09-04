import { Box, Button, Card, Container, Flex, Heading, Separator } from '@radix-ui/themes';
import { Link, useFetcher, useNavigation } from '@remix-run/react';
import { GAME_NAME } from '~/domain/Games/Game.constants';
import CreateOrJoinForm from './CreateOrJoinForm';

export default function Index() {
    const fetcher = useFetcher();
    const navigation = useNavigation();
    const isLoading = navigation.state === 'loading';

    const onCreateGame = () => {
        fetcher.submit({}, { action: '/games/create', method: 'post' });
    };

    return (
        <Flex direction="column" minHeight="100vh" style={{ background: 'var(--gray-1)' }}>
            <Box
                width="100%"
                p={{ initial: '4', sm: '6' }}
                height={{ initial: '10vh', sm: '20vh' }}
                style={{ background: 'var(--gray-2)' }}
            >
                <Flex width="100%" justify="between" align="center" height="100%">
                    <Heading size={{ initial: '6', sm: '7' }}>{GAME_NAME}</Heading>
                </Flex>
            </Box>

            <Box
                flexGrow="1"
                py={{ initial: '6', sm: '8' }}
                px={{ initial: '4', sm: '6' }}
                height={{ initial: '85vh', sm: 'auto' }}
            >
                <Container size={{ initial: '2', sm: '3' }}>
                    <Card size={{ initial: '2', sm: '3' }}>
                        <Flex direction="column" gap={{ initial: '6', sm: '4' }}>
                            <CreateOrJoinForm onClick={onCreateGame} isLoading={isLoading} />

                            <Separator size="4" />

                            <Flex justify="center" width="100%">
                                <Button variant="ghost" size={{ initial: '2', sm: '3' }} asChild>
                                    <Link to="/about">À propos</Link>
                                </Button>
                            </Flex>
                        </Flex>
                    </Card>
                </Container>
            </Box>
        </Flex>
    );
}
