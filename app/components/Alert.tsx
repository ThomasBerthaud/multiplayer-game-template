import { BellAlertIcon } from '@heroicons/react/24/solid';

type Props = {
    title: string;
    message?: string;
};

export default function Alert({ title, message = '' }: Props) {
    return (
        <aside className="alert variant-filled-error">
            <BellAlertIcon />
            <div className="alert-message">
                <h3>{title}</h3>
                <p>{message}</p>
            </div>
        </aside>
    );
}
