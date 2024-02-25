import { useNavigation } from '@remix-run/react';
import { AbsoluteCenter, Box, Card, Divider, Heading, VStack } from '@chakra-ui/react';
import JoinGameForm from '~/routes/_index/JoinGameForm';
import ActionButton from '~/components/ActionButton';

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
                    <ActionButton action="/games/create" label="Create Game" isLoading={isLoading} noNavigation />
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
