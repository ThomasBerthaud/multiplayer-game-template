import { Heading } from '@radix-ui/themes';

type Props = {
    userName: string;
};
export default function UserName({ userName }: Props) {
    return <Heading as="h6">{userName}</Heading>;
}
