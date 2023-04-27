import * as React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import Main from './Main';
import { BrowserRouter } from 'react-router-dom';
import InterceptorInit from './components/InterceptorInit';

export const App = () => (
  // <React.StrictMode>
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <InterceptorInit />
      <Main />
    </BrowserRouter>
  </ChakraProvider>
  // </React.StrictMode>
);
