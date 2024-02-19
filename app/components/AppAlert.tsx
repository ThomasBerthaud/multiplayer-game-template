import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@chakra-ui/alert';

type Props = {
    title: string;
    message?: string;
};

export default function AppAlert({ title, message = '' }: Props) {
    return (
        <Alert status="error">
            <AlertIcon />
            <AlertTitle>{title}</AlertTitle>
            {message && <AlertDescription>{message}</AlertDescription>}
        </Alert>
    );
}
