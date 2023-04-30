import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useState } from 'react';
import GenericService from '../../service/GenericService';
import { useNavigate } from 'react-router-dom';
import RegisterRequest from '../../dto/RegisterRequest';
import FileUpload from '../FileUpload';
import UserProfile from '../../dto/UserProfile';

export default function Register() {
  const [userPicture, setUserPicture] = useState<string>();
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
  });
  const updateFormData = (evt: any) => {
    const name = evt.target.name;
    const value =
      evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const updateFileList = (files: Array<any>) => {
    console.log('picture', files.length, files[0], files);
    setUserPicture(files[0]);
  };

  const navigate = useNavigate();

  const onSubmit = () => {
    const data: RegisterRequest = {
      firstname: form.firstname,
      lastname: form.lastname,
      username: form.username,
      email: form.email,
      password: form.password,
      picture: userPicture,
    };
    console.log('userData', data);
    GenericService.create<RegisterRequest>('api/v1/auth/register', data).then(
      (data: any) => {
        console.log(data);
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.access_token);
        GenericService.get<UserProfile>('api/v1/auth/me').then(
          (userProfile: UserProfile) => {
            localStorage.setItem('user', JSON.stringify(userProfile));
            navigate('/offers');
          }
        );
      }
    );
  };

  return (
    <Center>
      <Box width={'3xl'}>
        <FormControl isRequired>
          <FormLabel>First name</FormLabel>
          <Input
            placeholder="First name"
            value={form.firstname}
            name="firstname"
            onChange={(e) => updateFormData(e)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Last name</FormLabel>
          <Input
            name="lastname"
            value={form.lastname}
            placeholder="Last name"
            onChange={(e) => updateFormData(e)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            name="username"
            value={form.username}
            placeholder="Username"
            onChange={(e) => updateFormData(e)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>E-Mail</FormLabel>
          <Input
            name="email"
            value={form.email}
            placeholder="E-Mail"
            onChange={(e) => updateFormData(e)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            value={form.password}
            type="password"
            placeholder="Password"
            onChange={(e) => updateFormData(e)}
          />
        </FormControl>
        <FileUpload callback={updateFileList} multiple={false} />
        <Button mt={4} colorScheme="teal" type="submit" onClick={onSubmit}>
          Submit
        </Button>
      </Box>
    </Center>
  );
}