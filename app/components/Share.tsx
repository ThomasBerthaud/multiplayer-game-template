import { IconButton, useClipboard, useToast } from '@chakra-ui/react';
import { LinkIcon } from '@chakra-ui/icons';
import { useEffect } from 'react';

export default function Share() {
    const { onCopy, setValue } = useClipboard('');
    const toast = useToast();

    useEffect(() => {
        setValue(window.location.href);
    }, []);

    const copyLinkToPasteBoard = () => {
        onCopy();

        toast({
            title: 'Lien copié dans le presse papier ! Partagez le à vos amis !',
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
    };

    return (
        <IconButton
            icon={<LinkIcon />}
            onClick={copyLinkToPasteBoard}
            aria-label={`Copier le lien de la partie dans le presse papier`}
        />
    );
}
