import { StarIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';

export default function Stars({ num }: StarsProps) {
  return (
    <Box as="span">
      {Array.from(Array(5).keys()).map((_, idx) => {
        return idx < (num || 0) ? (
          <StarIcon key={idx} color={'yellow.300'} />
        ) : (
          <StarIcon key={idx} color={'gray.400'} />
        );
      })}
    </Box>
  );
}

interface StarsProps {
  num: number | undefined;
}
