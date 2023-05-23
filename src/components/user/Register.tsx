import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useState } from 'react';
import GenericApiService from '../../service/GenericApiService';
import { useNavigate } from 'react-router-dom';
import RegisterRequest from '../../dto/RegisterRequest';
import FileUpload from '../FileUpload';
import UserProfile from '../../dto/UserProfile';
import Header from '../job/Header';

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
    setUserPicture(files[0]);
  };

  const navigate = useNavigate();

  const onSubmit = (event: any) => {
    event.preventDefault();
    const data: RegisterRequest = {
      firstname: form.firstname,
      lastname: form.lastname,
      username: form.username,
      email: form.email,
      password: form.password,
      picture: userPicture,
    };
    GenericApiService.create<RegisterRequest>(
      'api/v1/auth/register',
      data
    ).then((data: any) => {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.access_token);
      GenericApiService.get<UserProfile>('api/v1/auth/me').then(
        (userProfile: UserProfile) => {
          localStorage.setItem('user', JSON.stringify(userProfile));
          navigate('/offers');
        }
      );
    });
  };

  return (
    <>
      <Header title="Sign up" />
      <Center>
        <form onSubmit={onSubmit}>
          <Box width={'3xl'} boxShadow={'md'} p={4} mt={5}>
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
                type={'email'}
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
            <FileUpload
              callback={updateFileList}
              multiple={false}
              required={true}
            />
            <Button mt={4} colorScheme="teal" type="submit">
              Submit
            </Button>
          </Box>
        </form>
      </Center>
    </>
  );
}
