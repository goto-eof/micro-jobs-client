import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  Center,
  FormControl,
  FormHelperText,
  Image,
  Input,
  Text,
  Stack,
  Heading,
  ResponsiveValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import GenericApiService from '../../service/GenericApiService';
import { useParams } from 'react-router-dom';
import MessageRequest from '../../dto/MessageRequest';
import MessageResponse from '../../dto/MessageResponse';
import Title from '../job/Header';
import Job from '../../dto/Job';
import UserService from '../../service/UserService';

export default function SendMessage({ job }: { job?: Job }) {
  const [form, setForm] = useState({ message: '' });
  const { roomId, username } = useParams();
  const [alertMessage, setAlertMessage] = useState<string>();
  const [loggedInUsername] = useState<String>(UserService.getUsername());
  const [messages, setMessages] = useState<Array<MessageResponse>>(
    new Array<MessageResponse>()
  );

  useEffect(() => {
    GenericApiService.getAll<Array<MessageResponse>>(
      `api/v1/room/message/roomId/${roomId}`
    ).then(
      (data: Array<MessageResponse>) => {
        setMessages(data);
      },
      (err: any) => {
        setAlertMessage(err.response.data.message);
        window.scroll(0, 0);
      }
    );
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

  const sendMessage = () => {
    GenericApiService.createDifResponse<MessageRequest, MessageResponse>(
      `api/v1/room/message`,
      {
        message: form.message,
        roomId: Number(roomId),
      }
    ).then(
      (data: MessageResponse) => {
        const newMessages: Array<MessageResponse> = [...messages, data];
        setMessages(newMessages);
        setForm({ ...form, message: '' });
      },
      (err: any) => {
        setAlertMessage(err.response.data.message);
        window.scroll(0, 0);
      }
    );
  };

  const calculateMessageTo = () => {
    return '@' + username;
  };

  return (
    <>
      <Title title={'Message to: ' + calculateMessageTo()} />
      {alertMessage && (
        <Alert status="error">
          <AlertIcon />
          {alertMessage}
        </Alert>
      )}
      <Center>
        <Box
          w={'full'}
          // width={'500px'}
        >
          {messages &&
            messages.map((message) => (
              <MessageItem
                align={loggedInUsername === message.username ? 'right' : 'left'}
                key={message.id}
                message={message}
              />
            ))}
          <FormControl mt={3}>
            <Input
              type="text"
              name="message"
              value={form.message}
              onChange={(e) => updateFormData(e)}
            />
            <FormHelperText>Please write down your message</FormHelperText>
          </FormControl>
          <Button onClick={() => sendMessage()}>Send</Button>
        </Box>
      </Center>
    </>
  );
}

function MessageItem({
  message,
  align,
}: {
  message: MessageResponse;
  align: any;
}) {
  return (
    <Feature title={message.username} desc={message.message} align={align} />
  );
}

function Feature({
  title,
  desc,
  align,
  ...rest
}: {
  title: string;
  desc: string;
  align: any;
}) {
  return (
    <Box p={5} shadow="md" borderWidth="1px" {...rest} textAlign={align}>
      <Heading fontSize="xl">{title}</Heading>
      <Text mt={4}>{desc}</Text>
    </Box>
  );
}
