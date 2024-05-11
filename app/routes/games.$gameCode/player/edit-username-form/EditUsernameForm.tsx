import { useEffect, useState } from 'react';
import { FormControl, FormErrorMessage, HStack, IconButton } from '@chakra-ui/react';
import { CheckIcon, EditIcon } from '@chakra-ui/icons';
import { User } from '~/domain/Users/User.types';
import { useFetcher } from '@remix-run/react';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
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
            <HStack>
                <UserName userName={userName} />
                <IconButton
                    variant="link"
                    aria-label="Edit username"
                    icon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                />
            </HStack>
        );
    }

    return (
        <fetcher.Form ref={zo.ref} method="post" action={`/users/${user.id}/edit`}>
            <FormControl isInvalid={!!zo.errors.user_name()}>
                <HStack>
                    <InputGroup size="sm">
                        <Input
                            type="text"
                            name={zo.fields.user_name()}
                            value={userName}
                            onChange={(event) => setUserName(event.target.value)}
                        />
                        <InputRightElement>
                            <IconButton
                                variant="ghost"
                                type="submit"
                                aria-label="Save Username"
                                icon={<CheckIcon />}
                                size="xs"
                            />
                        </InputRightElement>
                    </InputGroup>
                </HStack>
                {zo.errors.user_name((e) => (
                    <FormErrorMessage>{e.message}</FormErrorMessage>
                ))}
            </FormControl>
        </fetcher.Form>
    );
}
