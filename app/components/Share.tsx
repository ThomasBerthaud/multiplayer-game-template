import { IconButton } from '@radix-ui/themes';
import { Link1Icon } from '@radix-ui/react-icons';
import { useClipboard } from '~/hooks/useClipboard';

export default function Share() {
    const { onCopy } = useClipboard('');

    const copyLinkToPasteBoard = () => {
        onCopy();

        // TODO : display message when copied !
        // toast({
        //     title: 'Lien copié dans le presse papier ! Partagez le à vos amis !',
        //     status: 'success',
        //     duration: 2000,
        //     isClosable: true,
        // });
    };

    return (
        <IconButton onClick={copyLinkToPasteBoard} aria-label={`Copier le lien de la partie dans le presse papier`}>
            <Link1Icon />
        </IconButton>
    );
}
