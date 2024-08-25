import { useFetcher } from '@remix-run/react';
import { useZorm } from 'react-zorm';
import { GameJoinFormSchema } from '~/domain/Games/schemas/GameJoinForm.schema';
import { Box, IconButton, TextField } from '@radix-ui/themes';
import { ArrowRightIcon } from '@radix-ui/react-icons';

export default function JoinGameForm() {
    const fetcher = useFetcher();
    const zo = useZorm('GameJoin', GameJoinFormSchema);

    return (
        <Box width="100%">
            <fetcher.Form ref={zo.ref} method="post" action="/games/join">
                <TextField.Root name={zo.fields.gameCode()} placeholder="Rejoindre une partie">
                    <TextField.Slot side="right">
                        <IconButton type="submit" aria-label="Rejoindre">
                            <ArrowRightIcon />
                        </IconButton>
                    </TextField.Slot>
                </TextField.Root>

                {zo.errors.gameCode((e) => (
                    <Box>{e.message}</Box>
                ))}
            </fetcher.Form>
        </Box>
    );
}
