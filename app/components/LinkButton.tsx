import { Button } from '@chakra-ui/react';
import { Link } from '@remix-run/react';

type Props = {
    to: string;
    isLoading?: boolean;
    label: string;
};
export default function LinkButton({ to, isLoading, label }: Props) {
    return (
        <Link to={to}>
            <Button colorScheme="purple" fontSize="lg" isLoading={isLoading}>
                {label}
            </Button>
        </Link>
    );
}
