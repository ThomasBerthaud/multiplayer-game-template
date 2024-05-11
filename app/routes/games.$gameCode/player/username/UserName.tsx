import { Heading } from '@chakra-ui/react';

type Props = {
    userName: string;
};
export default function UserName({ userName }: Props) {
    return (
        <Heading as="h6" size="sm">
            {userName}
        </Heading>
    );
}
