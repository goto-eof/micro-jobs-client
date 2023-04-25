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

export const App = () => (
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
