import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Image,
  Input,
  Select,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import GenericApiService from '../../service/GenericApiService';
import { useNavigate, useParams } from 'react-router-dom';
import Job from '../../dto/Job';
import FileUpload from '../FileUpload';
import JobConst from '../../consts/JobConst';
import Header from './Header';
import JobPicture from '../../dto/JobPicture';
import JobService from '../../service/JobService';

export default function InserUpdateJob() {
  const [form, setForm] = useState<Job>({
    title: '',
    description: '',
    price: 0,
    type: 0,
    id: undefined,
  });

  const [alertMessage, setAlertMessage] = useState<string>();
  let { id, scope } = useParams();
  const scopeFromUri = scope || 'public';
  const [job, setJob] = useState<Job>();

  const [files, setFiles] = useState(Array<string>);

  useEffect(() => {
    if (id) {
      GenericApiService.get<Job>(`api/v1/job/${scopeFromUri}/jobId/${id}`).then(
        (job) => {
          setJob(job);
          setForm({
            title: job.title,
            description: job.description,
            price: job.price,
            type: job.type,
            id: job.id,
          });
        }
      );
    }
  }, []);

  const updateFormData = (evt: any) => {
    const name = evt.target.name;
    const value =
      evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const onSubmit = (event: any) => {
    event.preventDefault();
    const data: Job = {
      title: form.title,
      description: form.description,
      type: form.type,
      jobPictureList: files
        .map((file) => {
          return {
            content: file,
          } as JobPicture;
        })
        .concat(job?.jobPictureList || []),
      price: form.price,
      id: form.id,
    };

    if (!form.id) {
      GenericApiService.create<Job>(`api/v1/job/${scopeFromUri}`, data).then(
        () => {
          if (form.type == JobConst.TYPE_OFFER) {
            navigate('/myOffers');
          } else if (form.type == JobConst.TYPE_REQUEST) {
            navigate('/myRequests');
          }
        },
        (err: any) => {
          setAlertMessage(err.response.data.message);
          window.scroll(0, 0);
        }
      );
    } else {
      GenericApiService.put<Job>(
        `api/v1/job/${scopeFromUri}/jobId`,
        form.id,
        data
      ).then(
        () => {
          if (form.type == JobConst.TYPE_OFFER) {
            navigate('/myOffers');
          } else if (form.type == JobConst.TYPE_REQUEST) {
            navigate('/myRequests');
          }
        },
        (err: any) => {
          setAlertMessage(err.response.data.message);
          window.scroll(0, 0);
        }
      );
    }
  };

  const updateFileList = (files: Array<any>) => {
    setFiles(files);
  };

  function deleteImage(pictureName: string) {
    if (job && job.jobPictureList) {
      const newJob = {
        ...job,
        jobPictureList: job.jobPictureList.filter(
          (jobPicture) => jobPicture.pictureName !== pictureName
        ),
      };
      setJob(newJob);
    }
  }

  return (
    <>
      <Header title="Insert Job" />
      {alertMessage && (
        <Alert status="error">
          <AlertIcon />
          {alertMessage}
        </Alert>
      )}
      <Center>
        <form onSubmit={onSubmit}>
          <Box width={'3xl'} boxShadow={'md'} p={4} mt={5}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                required={true}
                placeholder="Title"
                value={form.title}
                name="title"
                onChange={(e) => updateFormData(e)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Input
                required={true}
                name="description"
                value={form.description}
                placeholder="Description"
                onChange={(e) => updateFormData(e)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Price</FormLabel>
              <Input
                required={true}
                type="number"
                name="price"
                value={form.price}
                placeholder="Price"
                onChange={(e) => updateFormData(e)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Type</FormLabel>
              <Select
                required={true}
                placeholder="Select type"
                name="type"
                value={form.type}
                onChange={(e) => updateFormData(e)}
              >
                <option value="0">Offer</option>
                <option value="1">Request</option>
              </Select>
            </FormControl>
            <FileUpload
              required={false}
              callback={updateFileList}
              multiple={true}
            />
            <VStack>
              <SimpleGrid maxW={'100%'} columns={10} spacing={2}>
                {job?.jobPictureList &&
                  job.jobPictureList
                    .map((picture) => picture.pictureName)
                    .map((pictureName) => (
                      <Box key={pictureName}>
                        <Box maxW={'64px'} maxH={'64px'}>
                          <Image
                            boxSize="64px"
                            objectFit="cover"
                            src={JobService.getImageLink(pictureName)}
                          />
                        </Box>
                        <Button
                          colorScheme="red"
                          size="xs"
                          onClick={() => deleteImage(pictureName)}
                        >
                          Delete
                        </Button>
                      </Box>
                    ))}
              </SimpleGrid>
              <Box w={'100%'}>
                <Button mt={4} colorScheme="teal" type="submit">
                  Submit
                </Button>
              </Box>{' '}
            </VStack>
          </Box>
        </form>
      </Center>
    </>
  );
}
