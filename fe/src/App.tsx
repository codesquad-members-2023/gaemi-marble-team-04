import { router } from '@router/router';
import { GlobalStyle } from '@styles/GlobalStyle';
import { ModalRoot } from '@styles/common';
import { theme } from '@styles/designSystem';
import { DevTools } from 'jotai-devtools';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <DevTools />
      <RouterProvider router={router} />
      <ModalRoot id="modal-root" />
    </ThemeProvider>
  );
}
