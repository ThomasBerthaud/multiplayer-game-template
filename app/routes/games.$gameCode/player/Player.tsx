import { Badge, Card, CardBody, HStack } from '@chakra-ui/react';
import { User } from '~/domain/Users/User.types';
import { useLoaderData } from '@remix-run/react';
import { loader } from '~/routes/games.$gameCode/route';
import EditUsernameForm from './edit-username-form/EditUsernameForm';
import UserName from '~/routes/games.$gameCode/player/username/UserName';

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
                    {isYou ? <EditUsernameForm user={user} /> : <UserName userName={user.user_name} />}
                    <HStack gap={2}>
                        {isOwner && <Badge>Owner</Badge>}
                        {isYou && <Badge>You</Badge>}
                    </HStack>
                </HStack>
            </CardBody>
        </Card>
    );
}
