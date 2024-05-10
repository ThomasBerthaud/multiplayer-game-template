import { Badge, Card, CardBody, Heading, HStack } from '@chakra-ui/react';
import { User } from '~/domain/Users/User.types';
import { useLoaderData } from '@remix-run/react';
import { loader } from '~/routes/games.$gameCode/route';

type Props = {
    user: User;
};
export default function Player({ user }: Props) {
    const { you, gameLobby } = useLoaderData<typeof loader>();
    const isOwner = user.user_id === gameLobby.owner_id;
    const isYou = user.id === you.id;

    return (
        <Card variant="outline">
            <CardBody>
                <HStack justifyContent="space-between">
                    <Heading as="h6" size="sm">
                        {user.user_name}
                    </Heading>
                    <HStack gap={2}>
                        {isOwner && <Badge>Owner</Badge>}
                        {isYou && <Badge>You</Badge>}
                    </HStack>
                </HStack>
            </CardBody>
        </Card>
    );
}
