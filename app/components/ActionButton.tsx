import { Form, useFetcher } from '@remix-run/react';
import { Button } from '@chakra-ui/react';

type Props = {
    action: string;
    label: string;
    noNavigation?: boolean;
};

export default function ActionButton({ action, label, noNavigation }: Props) {
    const fetcher = useFetcher();
    const FormComponent = noNavigation ? fetcher.Form : Form;

    return (
        <FormComponent method="POST" action={action}>
            <Button type="submit">{label}</Button>
        </FormComponent>
    );
}
