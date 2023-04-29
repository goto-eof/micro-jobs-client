import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  Image,
  Text,
  Box,
  Skeleton,
  Flex,
  SimpleGrid,
  Grid,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import GenericService from '../service/GenericService';
import Job from '../dto/Job';
import GenericResponse from '../dto/GenericResponse';
import Pagination from './Pagination';
import PaginationUtil from '../util/PaginationUtil';
import { useNavigate } from 'react-router-dom';
import JobConst from '../consts/JobConst';
import { StarIcon } from '@chakra-ui/icons';

interface Props {
  baseUrl: string;
  urlCountItems: string;
}

export default function JobOffersRequests({ baseUrl, urlCountItems }: Props) {
  const [offers, setOffers] = useState<Array<Job>>(new Array<Job>());
  const [itemsCount, setItemsCount] = useState(0);
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    GenericService.getAll<Array<Job>>(baseUrl + '/0').then((data) => {
      GenericService.get<GenericResponse<number>>(urlCountItems).then(
        (genericResponse) => {
          setOffers(data);
          setItemsCount(genericResponse.value);
          setLoaded(true);
        }
      );
    });
  }, []);

  const goToPage = (page: number) => {
    GenericService.getAll<Array<Job>>(baseUrl + '/' + page).then((data) => {
      setOffers(data);
      window.scrollTo(0, 0);
    });
  };

  return (
    <>
      <SimpleGrid spacing={3}>
        {offers &&
          offers.map((item, idx) => <JobComponent key={idx} job={item} />)}
      </SimpleGrid>
      <Pagination
        callback={goToPage}
        numberOfPages={PaginationUtil.calculatePageNumber(itemsCount)}
      />
    </>
  );
}

interface JobProps {
  job: Job;
}

function JobComponent({ job }: JobProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const goToViewOfferRequest = (id: number | undefined) => {
    navigate('/view/' + id);
  };

  const calulateAcceptButtonLabel = () => {
    if (job.type === JobConst.TYPE_OFFER) {
      return 'Request service';
    }
    if (job.type === JobConst.TYPE_REQUEST) {
      return 'Provide service';
    }
    throw new Error('Function not implemented.');
  };

  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      overflow="hidden"
      variant="outline"
    >
      <Skeleton width={{ base: '100%', sm: '200px' }} isLoaded={imageLoaded}>
        <Image
          objectFit="cover"
          maxW={{ base: '100%', sm: '200px' }}
          h={{ base: '100%', sm: '100%' }}
          src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
          alt="Caffe Latte"
          onLoad={() => setImageLoaded(true)}
        />
      </Skeleton>

      <SimpleGrid columns={2} spacingX={100}>
        <Stack spacing={0}>
          <CardBody>
            <Heading size="md">{job.title} </Heading>
            <Box fontSize={'0.8em'}>
              by {job.author?.firstname} {job.author?.lastname}
              {' | '} <Stars num={job.author?.stars} />
            </Box>
            <Text py="2">{job.description}</Text>
          </CardBody>
          <CardFooter justify={'center'}>
            <Button variant="solid" colorScheme="blue">
              {calulateAcceptButtonLabel()}
            </Button>
            <Button
              mx={3}
              variant={'solid'}
              colorScheme="green"
              onClick={() => goToViewOfferRequest(job.id)}
            >
              View
            </Button>
          </CardFooter>
        </Stack>
        <Stack p={5} align={'end'} float={'right'}>
          <Box
            borderRadius={'10px'}
            verticalAlign={'top'}
            maxW={'200px'}
            boxShadow={'md'}
            p={10}
          >
            <Flex textAlign={'left'}>Price:</Flex>
            <Box fontSize={'1.3em'} fontWeight={'bold'}>
              {job.price}€
            </Box>
          </Box>
        </Stack>
      </SimpleGrid>
    </Card>
  );
}
interface StarsProps {
  num: number | undefined;
}
function Stars({ num }: StarsProps) {
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
