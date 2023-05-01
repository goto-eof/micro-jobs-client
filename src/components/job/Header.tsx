import { Box, Text } from '@chakra-ui/react';

export default function Title({ title }: Props) {
  return (
    <Box h={'25px'} bg={'gray.900'}>
      <Text
        fontWeight={'bold'}
        color={'gray.50'}
        fontSize={'1em'}
        textAlign={'center'}
      >
        {title}
      </Text>
    </Box>
  );
}

interface Props {
  title: string;
}
