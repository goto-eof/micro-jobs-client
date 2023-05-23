import { Box, Center, Link } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box minH={'500px'} bg={'gray.900'}>
      <Center color={'white'} p={5}>
        Implemented by
        <Link pl={1} color={'green.400'} href="http://andre-i.eu">
          Andrei Dodu
        </Link>
      </Center>
    </Box>
  );
}
