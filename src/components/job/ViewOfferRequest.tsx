import { useEffect, useState } from 'react';
import GenericService from '../../service/GenericService';
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

interface Props {}
export default function ViewOfferRequest({}: Props) {
  const [job, setJob] = useState<Job>();
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [modalImage, setModalImage] = useState<string>();

  let { id } = useParams();
  useEffect(() => {
    GenericService.get<Job>('api/v1/job/' + id).then((job) => {
      setJob(job);
    });
  }, []);

  function showUserButtons(job: Job) {
    return UserService.isSameUsername(job.author?.username || '');
  }

  const goToEditOfferRequest = (id: number | undefined) => {
    navigate('/editJob/' + id);
  };

  const deleteJobOfferRequest = (jobId: number | undefined) => {
    if (jobId) {
      deleteItem(jobId);
    }
  };

  const deleteItem = (jobId: number) => {
    GenericService.delete('api/v1/job', jobId).then((_) => {
      // setOffers(offers.filter((offer) => offer.id !== jobId));
      navigate('/offers');
    });
  };

  function openModal(image: string) {
    setModalImage(image);
    onOpen();
  }

  return (
    <>
      <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow="hidden"
        variant="outline"
      >
        {job && job.pictureName && (
          <Skeleton
            width={{ base: '100%', sm: '200px' }}
            isLoaded={imageLoaded}
          >
            <Image
              onClick={() =>
                job && job.pictureName && openModal(job.pictureName)
              }
              objectFit="cover"
              maxW={{ base: '100%', sm: '200px' }}
              h={{ base: '100%', sm: '100%' }}
              src={'/api/v1/jobPicture/files/' + job.pictureName}
              alt="Job Picture"
              onLoad={() => setImageLoaded(true)}
            />
          </Skeleton>
        )}
        {job && !job.pictureName && (
          <Skeleton
            width={{ base: '100%', sm: '200px' }}
            isLoaded={imageLoaded}
          >
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
              >
                {job && job.title}{' '}
              </Heading>
              <Box fontSize={'0.8em'}>
                by {job && job.author?.firstname} {job && job.author?.lastname}{' '}
                (@
                {job && job.author?.username}){' | '}{' '}
                <Stars num={job && job.author?.stars} />
              </Box>
              <Text py="2">{job && job.description}</Text>
            </CardBody>
            <CardFooter justify={'left'}>
              <Flex>
                {job &&
                  job.pictureNamesList &&
                  job.pictureNamesList.map((image, idx) => (
                    <Box
                      onClick={() => openModal(image)}
                      key={idx}
                      mr={5}
                      borderRadius={'10px'}
                      boxShadow={'md'}
                    >
                      <img src={'/api/v1/jobPicture/files/' + image} />
                    </Box>
                  ))}
              </Flex>
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
              <Box textAlign={'right'}>Price:</Box>
              <Box fontSize={'1.3em'} fontWeight={'bold'}>
                {job && job.price}€
              </Box>
              <Box mt={4}>
                <Button
                  display={job && !showUserButtons(job) ? '' : 'none'}
                  mr={3}
                  variant="solid"
                  colorScheme="blue"
                >
                  {job && JobService.calulateAcceptButtonLabel(job)}
                </Button>
                <Button
                  variant={'solid'}
                  colorScheme="red"
                  mr={3}
                  display={job && showUserButtons(job) ? '' : 'none'}
                  onClick={() => job && deleteJobOfferRequest(job.id)}
                >
                  Delete
                </Button>
                <Button
                  variant={'solid'}
                  colorScheme="green"
                  display={job && showUserButtons(job) ? '' : 'none'}
                  onClick={() => job && goToEditOfferRequest(job.id)}
                >
                  Edit
                </Button>
              </Box>
            </Box>
          </Flex>
        </SimpleGrid>
      </Card>
      <Modal isOpen={isOpen} size={'full'} onClose={onClose}>
        <ModalOverlay />
        <ModalContent onClick={onClose}>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box borderRadius={'10px'} boxShadow={'md'}>
              <img src={'/api/v1/jobPicture/files/' + modalImage} />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
