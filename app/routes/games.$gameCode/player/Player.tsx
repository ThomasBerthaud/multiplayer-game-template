import { Badge, Card, Flex, IconButton } from '@radix-ui/themes';
import { User } from '~/domain/Users/User.types';
import { useLoaderData } from '@remix-run/react';
import { loader } from '~/routes/games.$gameCode/route';
import EditUsernameForm from './edit-username-form/EditUsernameForm';
import UserName from '~/routes/games.$gameCode/player/username/UserName';
import { Cross2Icon } from '@radix-ui/react-icons';
import ActionButton from '~/components/ActionButton';

type Props = {
    user: User;
};
export default function Player({ user }: Props) {
    const { you, gameLobby } = useLoaderData<typeof loader>();
    const isOwner = user.user_id === gameLobby.owner_id;
    const isYou = user.id === you.id;
    const currentUserIsOwner = you.user_id === gameLobby.owner_id;

    return (
        <Card>
            <Flex justify="between">
                {isYou ? <EditUsernameForm user={user} /> : <UserName userName={user.user_name} />}
                <Flex gap="2" align="center">
                    {isOwner && <Badge>Owner</Badge>}
                    {isYou && <Badge>You</Badge>}
                    {currentUserIsOwner && !isYou && (
                        <form method="post" action="./force-remove">
                            <input type="hidden" name="targetUserId" value={user.id} />
                            <IconButton
                                type="submit"
                                variant="ghost"
                                size="1"
                                color="red"
                                aria-label="Forcer la sortie"
                                title="Forcer la sortie (test)"
                            >
                                <Cross2Icon />
                            </IconButton>
                        </form>
                    )}
                </Flex>
            </Flex>
        </Card>
    );
}
