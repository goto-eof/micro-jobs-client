import { useEffect, useState } from 'react';
import GenericApiService from '../../service/GenericApiService';
import Job from '../../dto/Job';
import { Card, CardBody } from '@chakra-ui/card';
import {
  Box,
  Image,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  CardFooter,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import UserService from '../../service/UserService';
import Stars from './Stars';
import JobService from '../../service/JobService';
import Title from './Header';
import JobConst from '../../consts/JobConst';
import DateUtil from '../../service/DateUtil';
import Room from '../../dto/Room';
import UserJobItemEditPanel from './panels/UserJobItemEditPanel';
import AdminJobItemPanel from './panels/AdminJobItemPanel';

interface Props {}
export default function ViewOfferRequest({}: Props) {
  const [job, setJob] = useState<Job>();
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [modalImage, setModalImage] = useState<string>();
  let { id, scope, status } = useParams();
  const scopeFromUrl = scope || 'public';

  useEffect(() => {
    GenericApiService.get<Job>(
      status !== undefined
        ? `api/v1/job/${scopeFromUrl}/admin/jobId/${id}`
        : `api/v1/job/${scopeFromUrl}/jobId/${id}`
    ).then((job: Job) => {
      setJob(job);
    });
  }, []);

  const showJobStatus =
    job &&
    (UserService.isAdmin() || UserService.isPublisher(job)) &&
    scope !== JobConst.SCOPE_PUBLIC;

  const openModalByImage = (imageName: string | undefined) => {
    if (imageName) {
      setModalImage(imageName);
      onOpen();
    }
  };

  const calculateTitle = (type: number | undefined): string => {
    if (type === 0) {
      return 'Offer';
    }
    if (type === 1) {
      return 'Request';
    }
    return '';
  };

  const retrieveFirstname = job && job.author?.firstname;
  const retrieveLastName = job && job.author?.lastname;
  function goToConversation(job: Job): void {
    if (job.author && UserService.isSameUsername(job.author?.username)) {
      return;
    }
    GenericApiService.get<Room>(`api/v1/room/jobId/${job.id}`).then(
      (room: Room) => {
        navigate(`/rooms/${room?.id}`);
      }
    );
  }

  const calculateUserIdColor = (job: Job) => {
    if (job.author && UserService.isSameUsername(job.author?.username)) {
      return 'gray.600';
    }
    return 'blue.400';
  };
  const goToViewOfferRequest = (job: Job) => {
    window.scrollTo(0, 0);
    if (job.type == JobConst.TYPE_OFFER) {
      navigate('/offers');
    } else if (job.type == JobConst.TYPE_REQUEST) {
      navigate('/requests');
    }
  };

  return (
    <>
      {job && <Title title={calculateTitle(job?.type)} />}
      <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow="hidden"
        variant="outline"
      >
        {JobPicture(job, imageLoaded, openModalByImage, setImageLoaded)}
        <SimpleGrid columns={{ base: 1, md: 2 }} w={'full'}>
          <Stack spacing={4} w={'full'}>
            <CardBody>
              <Heading
                cursor={'pointer'}
                color={'green.400'}
                _hover={{ color: 'greeen.500' }}
                size="md"
              >
                {job && job.title}{' '}
              </Heading>
              <Box fontSize={'0.8em'}>
                #{job?.id}
                {' | '}
                by {retrieveFirstname} {retrieveLastName} (
                <Box
                  as="span"
                  color={job && calculateUserIdColor(job)}
                  cursor={'pointer'}
                  userSelect={'none'}
                  onClick={() => job && goToConversation(job)}
                >
                  @{job && job.author?.username})
                </Box>{' '}
                on {(job && DateUtil.transformDate(job.lastModifiedDate)) || ''}
                {' | '} <Stars num={job && job.author?.stars} />
              </Box>
              <Text py="2">{job && job.description}</Text>
            </CardBody>
            <CardFooter justify={'left'}>
              <SimpleGrid maxW={'100%'} columns={4} spacing={2}>
                {job &&
                  job.jobPictureList &&
                  job.jobPictureList.map((image, idx) => (
                    <Box
                      onClick={() => openModalByImage(image.pictureName)}
                      key={idx}
                      mr={5}
                      maxW={'64px'}
                      maxH={'64px'}
                      borderRadius={'10px'}
                      boxShadow={'md'}
                    >
                      <Image
                        boxSize="64px"
                        objectFit="cover"
                        src={JobService.getImageLink(image.pictureName)}
                      />
                    </Box>
                  ))}
              </SimpleGrid>
            </CardFooter>
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
                {job && job.price}€
              </Box>
              {job && scope && (
                <Box mt={4}>
                  <UserJobItemEditPanel job={job} scope={scope} />
                  <AdminJobItemPanel
                    job={job}
                    scope={scope}
                    approveCallback={goToViewOfferRequest}
                  />
                </Box>
              )}
            </Box>
          </Flex>
        </SimpleGrid>
      </Card>
      {ModalShowPicture(isOpen, onClose, modalImage)}
    </>
  );
}

interface JobStatusProps {
  job: Job;
}

function JobStatus({ job }: JobStatusProps) {
  return (
    <Box
      color={
        JobService.isCreated(job.status) || JobService.isUpdated(job.status)
          ? 'gray.400'
          : 'green.400'
      }
      fontWeight={'bold'}
    >
      {JobService.retrieveStatus(job)}
    </Box>
  );
}

function JobPicture(
  job: Job | undefined,
  imageLoaded: boolean,
  openModal: (string: string | undefined) => void,
  setImageLoaded: any
) {
  return (
    <>
      {JobService.hasMainJobPicture(job) && (
        <Skeleton width={{ base: '100%', sm: '200px' }} isLoaded={imageLoaded}>
          <Image
            onClick={() => openModal(JobService.retrieveMainJobPicture(job))}
            objectFit="cover"
            maxW={{ base: '100%', sm: '200px' }}
            h={{ base: '100%', sm: '100%' }}
            src={JobService.getImageLink(
              JobService.retrieveMainJobPicture(job)
            )}
            alt="Job Picture"
            onLoad={() => setImageLoaded(true)}
          />
        </Skeleton>
      )}
      {!JobService.hasMainJobPicture(job) && (
        <Skeleton width={{ base: '100%', sm: '200px' }} isLoaded={imageLoaded}>
          <Image
            objectFit="cover"
            maxW={{ base: '100%', sm: '200px' }}
            h={{ base: '100%', sm: '100%' }}
            src={JobService.getImageLink('no_image.png')}
            alt="Job Picture"
            onLoad={() => setImageLoaded(true)}
          />
        </Skeleton>
      )}
    </>
  );
}

function ModalShowPicture(
  isOpen: boolean,
  onClose: () => void,
  modalImage: string | undefined
) {
  return (
    <Modal isOpen={isOpen} size={'full'} onClose={onClose}>
      <ModalOverlay />
      <ModalContent onClick={onClose}>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box borderRadius={'10px'} boxShadow={'md'}>
            <img src={JobService.getImageLink(modalImage)} />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
