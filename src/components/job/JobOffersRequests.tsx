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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import GenericService from '../../service/GenericService';
import Job from '../../dto/Job';
import GenericResponse from '../../dto/GenericResponse';
import Pagination from '../Pagination';
import PaginationUtil from '../../util/PaginationUtil';
import { useNavigate } from 'react-router-dom';
import JobConst from '../../consts/JobConst';
import UserService from '../../service/UserService';
import Stars from './Stars';
import JobService from '../../service/JobService';

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

  function showUserButtons(job: Job) {
    return UserService.isSameUsername(job.author?.username || '');
  }

  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      overflow="hidden"
      variant="outline"
    >
      {job.pictureName && (
        <Skeleton width={{ base: '100%', sm: '200px' }} isLoaded={imageLoaded}>
          <Image
            objectFit="cover"
            maxW={{ base: '100%', sm: '200px' }}
            h={{ base: '100%', sm: '100%' }}
            src={'/api/v1/jobPicture/files/' + job.pictureName}
            alt="Job Picture"
            onLoad={() => setImageLoaded(true)}
          />
        </Skeleton>
      )}
      {!job.pictureName && (
        <Skeleton width={{ base: '100%', sm: '200px' }} isLoaded={imageLoaded}>
          <Image
            objectFit="cover"
            maxW={{ base: '100%', sm: '200px' }}
            h={{ base: '100%', sm: '100%' }}
            src={'/api/v1/jobPicture/files/no_image.png'}
            alt="Job Picture"
            onLoad={() => setImageLoaded(true)}
          />
        </Skeleton>
      )}

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
              <Button
                display={!showUserButtons(job) ? '' : 'none'}
                mr={3}
                variant="solid"
                colorScheme="blue"
              >
                {JobService.calulateAcceptButtonLabel(job)}
              </Button>
            </Box>
          </Box>
        </Flex>
      </SimpleGrid>
    </Card>
  );
}
