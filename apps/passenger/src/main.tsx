import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"
import App from './App';

const config = defineConfig({
  globalCss: {
    html: {
      colorPalette: "blue",
    },
  },
})

export const system = createSystem(defaultConfig, config)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <App />
    </ChakraProvider>
  </StrictMode>
);
