import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import { useState } from 'react';
import GenericService from '../service/GenericService';
import { useNavigate } from 'react-router-dom';
import Job from '../dto/Job';

export default function InserJob() {
  const [form, setForm] = useState({ title: '', description: '', type: 0 });
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
    };
    GenericService.create<Job>('api/v1/job', data).then((data) => {
      console.log(data);
      if (form.type == 0) {
        navigate('/offers');
      } else if (form.type == 1) {
        navigate('/requests');
      }
    });
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
        <Button mt={4} colorScheme="teal" type="submit" onClick={onSubmit}>
          Submit
        </Button>
      </Box>
    </Center>
  );
}
