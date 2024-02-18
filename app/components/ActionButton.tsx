import { Form } from '@remix-run/react';

type Props = {
    action: string;
    label: string;
};

export default function ActionButton({ action, label }: Props) {
    return (
        <Form method="POST" action={action}>
            <button type="submit" className="btn variant-filled-primary">
                {label}
            </button>
        </Form>
    );
}
