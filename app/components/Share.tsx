import { useCallback } from 'react';
import { canShare } from '~/utils/canShare';

type Props = {
    content: string;
};

export default function Share({ content }: Props) {
    const shareSlug = useCallback(() => {
        navigator.share({
            title: 'Rejoignez la partie',
            url: window.location.href,
        });
    }, []);

    const displayCopyToast = useCallback(() => {
        // Remplacer par la logique de votre application pour afficher un toast
        console.log('Code copié dans le presse papier. Partagez le à vos amis !', content);
    }, [content]);

    return (
        <div className="flex items-center justify-end gap-2">
            <button
                className="btn-icon variant-ghost-tertiary"
                onClick={displayCopyToast}
                title="Copier le code de la partie"
            >
                <i className="fa-regular fa-clipboard"></i>
            </button>
            {canShare && (
                <button
                    className="btn-icon variant-ghost-tertiary"
                    onClick={shareSlug}
                    title="Partager le lien de la partie"
                >
                    <i className="fa-regular fa-share-from-square"></i>
                </button>
            )}
        </div>
    );
}
