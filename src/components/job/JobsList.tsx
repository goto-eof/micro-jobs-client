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
  Center,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import GenericApiService from '../../service/GenericApiService';
import Job from '../../dto/Job';
import Pagination from '../Pagination';
import PaginationUtil from '../../util/PaginationUtil';
import { useNavigate } from 'react-router-dom';
import UserService from '../../service/UserService';
import Stars from './Stars';
import JobService from '../../service/JobService';
import Title from './Header';
import JobConst from '../../consts/JobConst';
import DateUtil from '../../service/DateUtil';
import JobListPage from '../../dto/JobListPage';
import AdminJobItemPanel from './panels/AdminJobItemPanel';
import UserJobItemPanel from './panels/UserJobItemPanel';

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
  const BASE_URL_RETRIEVE_ITEMS: string =
    status !== undefined
      ? `api/v1/job/${scope}/admin/jobType/${type}`
      : `api/v1/job/${scope}/jobType/${type}`;

  const [offers, setOffers] = useState<Array<Job>>(new Array<Job>());
  const [itemsCount, setItemsCount] = useState(0);
  const [isLoaded, setLoaded] = useState(false);

  const removeElementFromList = (job: Job) => {
    setOffers(offers.filter((offer) => offer.id !== job.id));
    setItemsCount(itemsCount - 1);
  };

  useEffect(() => {
    GenericApiService.getAll<JobListPage>(
      `${BASE_URL_RETRIEVE_ITEMS}/page/0`
    ).then((jobListPageResponse) => {
      setOffers(jobListPageResponse.jobList);
      setItemsCount(jobListPageResponse.totalItems);
      setLoaded(true);
    });
  }, []);

  const goToPage = (page: number) => {
    GenericApiService.getAll<JobListPage>(
      BASE_URL_RETRIEVE_ITEMS + '/page/' + page
    ).then((jobListPageResponse) => {
      setOffers(jobListPageResponse.jobList);
      setItemsCount(jobListPageResponse.totalItems);
      window.scrollTo(0, 0);
    });
  };

  return (
    <>
      <Title title={title} />
      <SimpleGrid spacing={3} p={3}>
        {offers &&
          offers.map((item, idx) => (
            <JobComponent
              scope={scope}
              key={idx}
              job={item}
              status={status}
              removeElementFromList={removeElementFromList}
            />
          ))}
      </SimpleGrid>
      <Center>
        {' '}
        <Pagination
          callback={goToPage}
          numberOfPages={PaginationUtil.calculatePageNumber(itemsCount)}
        />
      </Center>
    </>
  );
}

interface JobProps {
  job: Job;
  scope: string;
  status?: number;
  removeElementFromList: (job: Job) => void;
}

function JobComponent({ job, scope, status, removeElementFromList }: JobProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const goToViewOfferRequest = (id: number | undefined) => {
    window.scrollTo(0, 0);
    navigate(
      status !== undefined
        ? `/view/${scope}/status/${status}/jobId/${id}`
        : `/view/${scope}/jobId/${id}`
    );
  };

  const showJobStatus =
    (UserService.isAdmin() || UserService.isPublisher(job)) &&
    scope !== JobConst.SCOPE_PUBLIC;

  return (
    <>
      <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow="hidden"
        variant="outline"
      >
        {JobService.hasMainJobPicture(job) && (
          <Skeleton
            width={{ base: '100%', sm: '200px' }}
            isLoaded={imageLoaded}
          >
            <Image
              onClick={() => goToViewOfferRequest(job.id)}
              cursor={'pointer'}
              objectFit="cover"
              maxW={{ base: '100%', sm: '200px' }}
              h={{ base: '100%', sm: '100%' }}
              src={
                '/api/v1/jobPicture/files/' +
                JobService.retrieveMainJobPicture(job)
              }
              alt="Job Picture"
              onLoad={() => setImageLoaded(true)}
            />
          </Skeleton>
        )}
        {!JobService.hasMainJobPicture(job) && (
          <Skeleton
            width={{ base: '100%', sm: '200px' }}
            isLoaded={imageLoaded}
          >
            <Image
              onClick={() => goToViewOfferRequest(job.id)}
              cursor={'pointer'}
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
                {'  '} <Stars num={job.author?.stars} /> {' | '}on{' '}
                {DateUtil.transformDate(job.lastModifiedDate) || ''}
              </Box>
              <Text py="2">{job.description}</Text>
            </CardBody>
            <CardFooter justify={'left'}></CardFooter>
          </Stack>
          <Flex w={'full'}>
            <Box
              borderRadius={'10px'}
              verticalAlign={'top'}
              w={'full'}
              textAlign={'right'}
              p={10}
            >
              {showJobStatus && <JobStatus job={job} />}
              <Box textAlign={'right'}>Price:</Box>
              <Box fontSize={'1.3em'} fontWeight={'bold'}>
                {job.price}€
              </Box>
              <Box mt={4}>
                <AdminJobItemPanel
                  scope={scope}
                  job={job}
                  approveCallback={removeElementFromList}
                />
              </Box>
            </Box>
          </Flex>
        </SimpleGrid>
      </Card>
    </>
  );
}

interface JobStatusProps {
  job: Job;
}
function JobStatus({ job }: JobStatusProps) {
  const [calculatedColor] = useState<string>(
    JobService.isCreated(job.status) ||
      JobService.isUpdated(job.status) ||
      JobService.isUnpublished(job.status)
      ? 'gray.400'
      : 'green.400'
  );
  const [calculatedStatus] = useState<string>(JobService.retrieveStatus(job));
  return (
    <Box color={calculatedColor} fontWeight={'bold'}>
      {calculatedStatus}
    </Box>
  );
}
