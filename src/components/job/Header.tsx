import { Box, Text } from '@chakra-ui/react';

export default function Title({ title }: Props) {
  return (
    <Box h={'50px'} bg={'gray.900'}>
      <Text color={'gray.50'} fontSize={'2em'} textAlign={'center'}>
        {title}
      </Text>
    </Box>
  );
}

interface Props {
  title: string;
}
