import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface Props {
  numberOfPages: number;
  callback: (page: number) => void;
}
export default function Pagination({ numberOfPages, callback }: Props) {
  const WINDOW_LENGTH = 5;
  const [selected, setSelected] = useState(0);
  const [offset, setOffset] = useState(0);
  const [pages, setPages] = useState(new Array<number>(WINDOW_LENGTH));

  useEffect(() => {
    const newPages = new Array<number>(WINDOW_LENGTH);
    if (numberOfPages < WINDOW_LENGTH) {
      for (let i = 0; i < numberOfPages; i++) {
        newPages[i] = offset + i;
      }
    } else {
      for (let i = 0; i < newPages.length && offset + i < numberOfPages; i++) {
        newPages[i] = offset + i;
      }
    }

    setPages(newPages);
  }, [offset, numberOfPages]);

  const goBack = () => {
    if (offset != 0) {
      setOffset(offset - 1);
    }
    if (selected > 0) {
      callback(selected - 1);
      setSelected(selected - 1);
    }
  };

  const goForward = () => {
    if (offset < numberOfPages - WINDOW_LENGTH) {
      setOffset(offset + 1);
    }
    if (selected < numberOfPages - 1) {
      callback(selected + 1);
      setSelected(selected + 1);
    }
  };

  return (
    <Box p={8} style={{ cursor: 'pointer', userSelect: 'none' }}>
      <Box
        key={'previous'}
        as="span"
        p={3}
        mx={1}
        onClick={() => goBack()}
        _hover={{ bg: 'lightyellow' }}
        display={numberOfPages > 1 ? '' : 'none'}
      >
        <ArrowLeftIcon />
      </Box>
      {pages &&
        numberOfPages > 1 &&
        pages.map((pageNumber, idx) => (
          <Box
            key={idx}
            as="span"
            p={3}
            mx={1}
            borderBottom={pageNumber == selected ? '4px' : ''}
            borderColor={'black'}
            onClick={() => {
              setSelected(pageNumber);
              callback(pageNumber);
            }}
            _hover={{ bg: 'lightyellow' }}
          >
            {pageNumber + 1}
          </Box>
        ))}
      <Box
        key={'next'}
        as="span"
        p={3}
        mx={1}
        onClick={() => goForward()}
        _hover={{ bg: 'lightyellow' }}
        display={numberOfPages > 1 ? '' : 'none'}
      >
        <ArrowRightIcon />
      </Box>
    </Box>
  );
}
