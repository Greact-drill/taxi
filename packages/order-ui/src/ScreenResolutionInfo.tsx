import { Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export function ScreenResolutionInfo() {
  const [screenResolution, setScreenResolution] = useState('');

  useEffect(() => {
    const updateScreenResolution = () => {
      setScreenResolution(`${window.screen.width}x${window.screen.height}`);
    };

    updateScreenResolution();
    window.addEventListener('resize', updateScreenResolution);
    return () => window.removeEventListener('resize', updateScreenResolution);
  }, []);

  if (screenResolution === '') return null;

  return (
    <Text fontSize="10px" color="gray.500" textAlign="center" py="1">
      Экран: {screenResolution}
    </Text>
  );
}
