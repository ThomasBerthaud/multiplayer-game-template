import { Badge, Card, Flex } from '@radix-ui/themes';
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
        <Card className="glass-effect">
            <Flex justify="between">
                {isYou ? <EditUsernameForm user={user} /> : <UserName userName={user.user_name} />}
                <Flex gap="2">
                    {isOwner && <Badge>Owner</Badge>}
                    {isYou && <Badge>You</Badge>}
                </Flex>
            </Flex>
        </Card>
    );
}
