import { ArrowRightIcon } from '@radix-ui/react-icons';
import { Box, IconButton, Text, TextField } from '@radix-ui/themes';
import { useFetcher, useNavigation } from '@remix-run/react';
import { useZorm } from 'react-zorm';
import { GameJoinFormSchema } from '~/domain/Games/schemas/GameJoinForm.schema';

export default function JoinGameForm() {
    const fetcher = useFetcher();
    const zo = useZorm('GameJoin', GameJoinFormSchema);
    const navigation = useNavigation();
    const isLoading = navigation.state === 'loading';

    return (
        <Box width="100%">
            <fetcher.Form ref={zo.ref} method="post" action="/games/join">
                <TextField.Root
                    name={zo.fields.gameCode()}
                    placeholder="Rejoignez une partie existante"
                    size={{ initial: '2', sm: '3' }}
                >
                    <TextField.Slot side="right">
                        <IconButton
                            type="submit"
                            aria-label="Rejoindre"
                            variant="ghost"
                            loading={isLoading}
                            size={{ initial: '2', sm: '3' }}
                        >
                            <ArrowRightIcon />
                        </IconButton>
                    </TextField.Slot>
                </TextField.Root>

                {zo.errors.gameCode((e) => (
                    <Text as="p" size={{ initial: '2', sm: '3' }} color="red" mt="2">
                        {e.message}
                    </Text>
                ))}
            </fetcher.Form>
        </Box>
    );
}
