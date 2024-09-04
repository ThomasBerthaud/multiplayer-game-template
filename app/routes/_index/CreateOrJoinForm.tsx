import { PlusIcon } from '@radix-ui/react-icons';
import { Button, Flex, Separator } from '@radix-ui/themes';
import JoinGameForm from './JoinGameForm';

type Props = {
    onClick: () => void;
    isLoading: boolean;
};

export default function CreateOrJoinForm({ onClick, isLoading }: Props) {
    return (
        <Flex direction="column" gap={{ initial: '5', sm: '6' }}>
            <Button type="button" onClick={onClick} loading={isLoading} size={{ initial: '2', sm: '3' }}>
                Créer une partie <PlusIcon />
            </Button>

            <Flex justify="center" width="100%">
                <Separator size="3" />
            </Flex>

            <JoinGameForm />
        </Flex>
    );
}
