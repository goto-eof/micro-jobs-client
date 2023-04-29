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

  const deleteItem = (jobId: number) => {
    GenericService.delete('api/v1/job', jobId).then((_) => {
      setOffers(offers.filter((offer) => offer.id !== jobId));
    });
  };

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
          offers.map((item, idx) => (
            <JobComponent key={idx} deleteItem={deleteItem} job={item} />
          ))}
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
  deleteItem: (jobId: number) => void;
}

function JobComponent({ job, deleteItem }: JobProps) {
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
  const deleteJobOfferRequest = (jobId: number | undefined) => {
    if (jobId) {
      deleteItem(jobId);
    }
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

      <SimpleGrid columns={{ base: 1, md: 2 }} w={'full'}>
        <Stack spacing={4} w={'full'}>
          <CardBody>
            <Heading
              cursor={'pointer'}
              color={'blue.400'}
              _hover={{ color: 'blue.500' }}
              size="md"
              onClick={() => goToViewOfferRequest(job.id)}
            >
              {job.title}{' '}
            </Heading>
            <Box fontSize={'0.8em'}>
              by {job.author?.firstname} {job.author?.lastname}
              {' | '} <Stars num={job.author?.stars} />
            </Box>
            <Text py="2">{job.description}</Text>
          </CardBody>
          <CardFooter justify={'center'}></CardFooter>
        </Stack>
        <Flex w={'full'}>
          <Box
            borderRadius={'10px'}
            verticalAlign={'top'}
            w={'full'}
            textAlign={'right'}
            p={10}
          >
            <Box textAlign={'right'}>Price:</Box>
            <Box fontSize={'1.3em'} fontWeight={'bold'}>
              {job.price}€
            </Box>
            <Box mt={4}>
              <Button mr={3} variant="solid" colorScheme="blue">
                {calulateAcceptButtonLabel()}
              </Button>
              <Button
                variant={'solid'}
                colorScheme="green"
                onClick={() => goToViewOfferRequest(job.id)}
              >
                View
              </Button>{' '}
              <Button
                variant={'solid'}
                colorScheme="red"
                onClick={() => deleteJobOfferRequest(job.id)}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Flex>
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
