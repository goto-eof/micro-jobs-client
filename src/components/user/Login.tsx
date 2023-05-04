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
import LoginRequest from '../../dto/LoginRequest';
import UserProfile from '../../dto/UserProfile';
import Header from '../job/Header';

export default function Login() {
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

  const navigate = useNavigate();

  const onSubmit = () => {
    const data: LoginRequest = {
      username: form.username,
      password: form.password,
    };
    GenericService.create<LoginRequest>('api/v1/auth/authenticate', data).then(
      (data: any) => {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
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
    <>
      <Header title="Sign in" />
      <Center>
        <Box width={'3xl'} boxShadow={'md'} p={4} mt={5}>
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
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              value={form.password}
              type="password"
              placeholder="Password"
              onChange={(e) => updateFormData(e)}
            />
          </FormControl>
          <Button mt={4} colorScheme="teal" type="submit" onClick={onSubmit}>
            Submit
          </Button>
        </Box>
      </Center>
    </>
  );
}
