import { useFetcher } from '@remix-run/react';
import { useZorm } from 'react-zorm';
import { GameJoinFormSchema } from '~/domain/Games/schemas/GameJoinForm.schema';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Box, FormControl, FormErrorMessage, IconButton } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';

export default function JoinGameForm() {
    const fetcher = useFetcher();
    const zo = useZorm('GameJoin', GameJoinFormSchema);

    return (
        <Box w="60%" mt={2} mb={8}>
            <fetcher.Form ref={zo.ref} method="post" action="/games/join">
                <FormControl isInvalid={!!zo.errors.gameCode()}>
                    <InputGroup size="lg">
                        <Input pr="4.5rem" type="text" name={zo.fields.gameCode()} placeholder="Rejoindre une partie" />
                        <InputRightElement>
                            <IconButton type="submit" aria-label="Rejoindre" icon={<ArrowForwardIcon />} />
                        </InputRightElement>
                    </InputGroup>
                    {zo.errors.gameCode((e) => (
                        <FormErrorMessage>{e.message}</FormErrorMessage>
                    ))}
                </FormControl>
            </fetcher.Form>
        </Box>
    );
}
