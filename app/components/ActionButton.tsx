import { Form } from '@remix-run/react';
import { Button } from '@chakra-ui/react';

type Props = {
    action: string;
    label: string;
    isLoading?: boolean;
};

export default function ActionButton({ action, label, isLoading }: Props) {
    return (
        <Form method="POST" action={action}>
            <Button type="submit" isLoading={isLoading}>
                {label}
            </Button>
        </Form>
    );
}
