import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import GenericService from '../../service/GenericService';
import { useNavigate, useParams } from 'react-router-dom';
import Job from '../../dto/Job';
import FileUpload from '../FileUpload';
import JobConst from '../../consts/JobConst';
import Header from './Header';
import JobPicture from '../../dto/JobPicture';
import JobService from '../../service/JobService';

export default function InserJob() {
  const [form, setForm] = useState<Job>({
    title: '',
    description: '',
    price: 0,
    type: 0,
    id: undefined,
  });

  let { id, scope } = useParams();
  const scopeFromUri = scope || 'public';
  const [job, setJob] = useState<Job>();

  const [files, setFiles] = useState(Array<string>);

  useEffect(() => {
    if (id) {
      GenericService.get<Job>(`api/v1/job/${scopeFromUri}/${id}`).then(
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

  const onSubmit = () => {
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
        .concat(job?.jobPictureList || [] ),
      price: form.price,
      id: form.id,
    };

    if (!form.id) {
      GenericService.create<Job>(`api/v1/job/${scopeFromUri}`, data).then(
        () => {
          if (form.type == JobConst.TYPE_OFFER) {
            navigate('/myOffers');
          } else if (form.type == JobConst.TYPE_REQUEST) {
            navigate('/myRequests');
          }
        }
      );
    } else {
      GenericService.put<Job>(`api/v1/job/${scopeFromUri}`, form.id, data).then(
        () => {
          if (form.type == JobConst.TYPE_OFFER) {
            navigate('/myOffers');
          } else if (form.type == JobConst.TYPE_REQUEST) {
            navigate('/myRequests');
          }
        }
      );
    }
  };

  const updateFileList = (files: Array<any>) => {
    setFiles(files);
    console.log(files);
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
      <Center>
        <Box width={'3xl'} boxShadow={'md'} p={4} mt={5}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              placeholder="Title"
              value={form.title}
              name="title"
              onChange={(e) => updateFormData(e)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Input
              name="description"
              value={form.description}
              placeholder="Description"
              onChange={(e) => updateFormData(e)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Price</FormLabel>
            <Input
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
              placeholder="Select type"
              name="type"
              value={form.type}
              onChange={(e) => updateFormData(e)}
            >
              <option value="0">Offer</option>
              <option value="1">Request</option>
            </Select>
          </FormControl>
          <FileUpload callback={updateFileList} multiple={true} />
          <VStack>
            <HStack w={'100%'}>
              {job?.jobPictureList &&
                job.jobPictureList
                  .map((picture) => picture.pictureName)
                  .map((pictureName) => (
                    <Box w={'64px'}>
                      <img
                        key={pictureName}
                        style={{ width: '64px', height: '64px', float: 'left' }}
                        src={JobService.getImageLink(pictureName)}
                      />
                      <Button onClick={() => deleteImage(pictureName)}>
                        Delete
                      </Button>
                    </Box>
                  ))}
            </HStack>
            <Box w={'100%'}>
              <Button
                mt={4}
                colorScheme="teal"
                type="submit"
                onClick={onSubmit}
              >
                Submit
              </Button>
            </Box>{' '}
          </VStack>
        </Box>
      </Center>
    </>
  );
}
