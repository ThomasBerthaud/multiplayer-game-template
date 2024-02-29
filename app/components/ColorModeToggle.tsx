import { IconButton, Tooltip, useColorMode } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

export default function ColorModeToggle() {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <Tooltip hasArrow placement="left" label={`Mode ${colorMode === 'light' ? 'sombre' : 'clair'}`}>
            <IconButton
                onClick={toggleColorMode}
                aria-label="Color toggle"
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            />
        </Tooltip>
    );
}
