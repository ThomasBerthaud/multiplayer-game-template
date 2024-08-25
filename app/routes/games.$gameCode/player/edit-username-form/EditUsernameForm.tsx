import { useEffect, useState } from 'react';
import { Box, Flex, IconButton, TextField } from '@radix-ui/themes';
import { CheckIcon, Pencil2Icon } from '@radix-ui/react-icons';
import { User } from '~/domain/Users/User.types';
import { useFetcher } from '@remix-run/react';
import { useZorm } from 'react-zorm';
import { UserEditFormSchema } from '~/domain/Users/schemas/UserEditFormSchema';
import UserName from '~/routes/games.$gameCode/player/username/UserName';

type Props = {
    user: User;
};

export default function EditUsernameForm({ user }: Props) {
    const fetcher = useFetcher();
    const zo = useZorm('EditUsername', UserEditFormSchema, {
        onValidSubmit: () => {
            // need to wait for the form to be submitted before setting isEditing to false
            setTimeout(() => {
                setIsEditing(false);
            }, 50);
        },
    });
    const [userName, setUserName] = useState(user.user_name);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setUserName(user.user_name);
    }, [user]);

    if (!isEditing) {
        return (
            <Flex>
                <UserName userName={userName} />
                <IconButton variant="ghost" aria-label="Edit username" onClick={() => setIsEditing(true)}>
                    <Pencil2Icon />
                </IconButton>
            </Flex>
        );
    }

    return (
        <fetcher.Form ref={zo.ref} method="post" action={`/users/${user.id}/edit`}>
            <Flex>
                <TextField.Root
                    type="text"
                    name={zo.fields.user_name()}
                    value={userName}
                    onChange={(event) => setUserName(event.target.value)}
                >
                    <TextField.Slot side="right">
                        <IconButton variant="ghost" type="submit" aria-label="Save Username">
                            <CheckIcon />
                        </IconButton>
                    </TextField.Slot>
                </TextField.Root>
            </Flex>
            {zo.errors.user_name((e) => (
                <Box>{e.message}</Box>
            ))}
        </fetcher.Form>
    );
}
