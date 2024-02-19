import { Link, useNavigation } from '@remix-run/react';
import { AbsoluteCenter, Box, Button, Card, Divider, Heading, VStack } from '@chakra-ui/react';

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
                    <Link to="/games/join">
                        <Button colorScheme="purple" fontSize="lg" isLoading={isLoading}>
                            Rejoindre une partie
                        </Button>
                    </Link>
                </VStack>
            </Card>
        </VStack>
    );
}
