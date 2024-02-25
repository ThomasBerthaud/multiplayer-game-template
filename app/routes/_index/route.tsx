import { useFetcher, useNavigation } from '@remix-run/react';
import { AbsoluteCenter, Box, Button, Card, Divider, Heading, VStack } from '@chakra-ui/react';
import JoinGameForm from '~/routes/_index/JoinGameForm';

export default function Index() {
    const fetcher = useFetcher();
    const navigation = useNavigation();
    const isLoading = navigation.state === 'loading';

    const onCreateGame = () => {
        fetcher.submit({}, { action: '/games/create', method: 'post' });
    };

    return (
        <VStack spacing={6}>
            <Box w="100%" p={8} bgColor="purple.400">
                <Heading textAlign="center">Bienvenue</Heading>
            </Box>
            <Card w="60%" alignItems="center" py={4} px={6}>
                <VStack w="100%" spacing={4}>
                    <Button type="button" onClick={onCreateGame} isLoading={isLoading}>
                        Créer une partie
                    </Button>
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
