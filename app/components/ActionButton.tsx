import { Form } from '@remix-run/react';
import { Button, ButtonProps } from '@radix-ui/themes';

type Props = ButtonProps & {
    action: string;
    label: string;
};

export default function ActionButton({ action, label, ...buttonProps }: Props) {
    return (
        <Form method="POST" action={action}>
            <Button type="submit" {...buttonProps}>
                {label}
            </Button>
        </Form>
    );
}
