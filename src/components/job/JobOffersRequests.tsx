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
import UserService from '../../service/UserService';
import Stars from './Stars';
import JobService from '../../service/JobService';
import Title from './Title';
import JobConst from '../../consts/JobConst';

interface Props {
  type: number;
  scope: string;
  title: string;
  status?: number;
}

export default function JobOffersRequests({
  type,
  scope,
  title,
  status,
}: Props) {
  console.log(status);
  const BASE_URL_RETRIEVE_ITEMS: string =
    status !== undefined
      ? `api/v1/job/${scope}/admin/${type}/${status}`
      : `api/v1/job/${scope}/${type}`;
  const BASE_URL_RETRIEVE_ITEMS_FIRST_PAGE: string = `${BASE_URL_RETRIEVE_ITEMS}/0`;
  const BASE_URL_COUNT_ITEMS: string =
    status !== undefined
      ? `api/v1/job/${scope}/admin/count/${type}/${status}`
      : `api/v1/job/${scope}/count/${type}`;

  const [offers, setOffers] = useState<Array<Job>>(new Array<Job>());
  const [itemsCount, setItemsCount] = useState(0);
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    GenericService.getAll<Array<Job>>(BASE_URL_RETRIEVE_ITEMS_FIRST_PAGE).then(
      (data) => {
        GenericService.get<GenericResponse<number>>(BASE_URL_COUNT_ITEMS).then(
          (genericResponse) => {
            setOffers(data);
            setItemsCount(genericResponse.value);
            setLoaded(true);
          }
        );
      }
    );
  }, []);

  const goToPage = (page: number) => {
    GenericService.getAll<Array<Job>>(
      BASE_URL_RETRIEVE_ITEMS + '/' + page
    ).then((data) => {
      setOffers(data);
      window.scrollTo(0, 0);
    });
  };

  return (
    <>
      <Title title={title} />
      <SimpleGrid spacing={3}>
        {offers &&
          offers.map((item, idx) => (
            <JobComponent scope={scope} key={idx} job={item} status={status} />
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
  scope: string;
  status?: number;
}

function JobComponent({ job, scope, status }: JobProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const goToViewOfferRequest = (id: number | undefined) => {
    navigate(
      status !== undefined
        ? `/view/${scope}/${status}/${id}`
        : `/view/${scope}/${id}`
    );
  };

  function showUserButtons(job: Job) {
    return UserService.isSameUsername(job.author?.username || '');
  }

  const approve = (job: Job): void => {
    GenericService.post<Job>('api/v1/job/private/' + job.id).then((job) => {
      navigate(job.type === JobConst.TYPE_OFFER ? '/offers' : '/requests');
    });
  };

  return (
    <>
      <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow="hidden"
        variant="outline"
      >
        {job.pictureName && (
          <Skeleton
            width={{ base: '100%', sm: '300px' }}
            isLoaded={imageLoaded}
          >
            <Image
              objectFit="cover"
              maxW={{ base: '100%', sm: '300px' }}
              h={{ base: '100%', sm: '100%' }}
              src={'/api/v1/jobPicture/files/' + job.pictureName}
              alt="Job Picture"
              onLoad={() => setImageLoaded(true)}
            />
          </Skeleton>
        )}
        {!job.pictureName && (
          <Skeleton
            width={{ base: '100%', sm: '300px' }}
            isLoaded={imageLoaded}
          >
            <Image
              objectFit="cover"
              maxW={{ base: '100%', sm: '300px' }}
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
                {UserService.isAdmin() && JobService.isCreated(job.status) && (
                  <Button
                    mr={3}
                    variant="solid"
                    colorScheme="blue"
                    onClick={() => approve(job)}
                  >
                    Approve
                  </Button>
                )}
              </Box>
            </Box>
          </Flex>
        </SimpleGrid>
      </Card>
    </>
  );
}
