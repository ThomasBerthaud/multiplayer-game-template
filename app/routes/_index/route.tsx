import { Link, useFetcher, useNavigation } from '@remix-run/react';
import { Box, Button, Center, Container, Divider, Heading, HStack, useColorModeValue, VStack } from '@chakra-ui/react';
import JoinGameForm from '~/routes/_index/JoinGameForm';
import { AddIcon } from '@chakra-ui/icons';
import ColorModeToggle from '~/components/ColorModeToggle';

export default function Index() {
    const fetcher = useFetcher();
    const navigation = useNavigation();
    const isLoading = navigation.state === 'loading';

    const onCreateGame = () => {
        fetcher.submit({}, { action: '/games/create', method: 'post' });
    };

    const bgColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <VStack h="100vh">
            <Box w="100%" p={8} bgColor={bgColor}>
                <HStack justifyContent="space-between">
                    <Heading textAlign="center">The Game</Heading>
                    <ColorModeToggle />
                </HStack>
            </Box>
            <Container flex="1">
                <Center minHeight="80%">
                    <VStack w="100%">
                        <Button
                            w="60%"
                            size="lg"
                            type="button"
                            onClick={onCreateGame}
                            isLoading={isLoading}
                            rightIcon={<AddIcon />}
                        >
                            Créer une partie
                        </Button>
                        <JoinGameForm />
                        <Divider w="60%" />
                        <Button mt={8} size="lg" as={Link} to="/about" variant="ghost">
                            À propos
                        </Button>
                    </VStack>
                </Center>
            </Container>
        </VStack>
    );
}
