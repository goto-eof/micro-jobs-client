import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import GenericService from '../service/GenericService';
import { useNavigate, useParams } from 'react-router-dom';
import Job from '../dto/Job';
import FileUpload from './FileUpload';

export default function InserJob() {
  const [form, setForm] = useState<Job>({
    title: '',
    description: '',
    price: 0,
    type: 0,
    id: undefined,
  });

  let { id } = useParams();

  const [files, setFiles] = useState(Array<string>);

  useEffect(() => {
    if (id) {
      GenericService.get<Job>('api/v1/job/' + id).then((job) => {
        setForm({
          title: job.title,
          description: job.description,
          price: job.price,
          type: job.type,
          id: job.id,
        });
      });
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
      images: files,
      price: form.price,
      id: form.id,
    };

    if (!form.id) {
      GenericService.create<Job>('api/v1/job', data).then((data) => {
        console.log(data);
        if (form.type == 0) {
          navigate('/offers');
        } else if (form.type == 1) {
          navigate('/requests');
        }
      });
    } else {
      GenericService.put<Job>('api/v1/job', form.id, data).then((data) => {
        console.log(data);
        if (form.type == 0) {
          navigate('/offers');
        } else if (form.type == 1) {
          navigate('/requests');
        }
      });
    }
  };

  const updateFileList = (files: Array<any>) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <Center>
      <Box width={'3xl'}>
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

        <Button mt={4} colorScheme="teal" type="submit" onClick={onSubmit}>
          Submit
        </Button>
      </Box>
    </Center>
  );
}
