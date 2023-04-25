import { Box } from '@chakra-ui/react';

interface Props {
  pages: number;
  callback: (page: number) => void;
}
export default function Pagination({ pages, callback }: Props) {
  return (
    <Box>
      {pages &&
        [...Array(pages).keys()]
          .filter((item) => item % 10 == 0)
          .map((item, idx) => (
            <Box
              key={idx}
              as="span"
              w={'16px'}
              h={'16px'}
              mx={2}
              boxShadow={'dark-lg'}
              onClick={() => callback(item / 10)}
            >
              {item / 10}
            </Box>
          ))}
    </Box>
  );
}
