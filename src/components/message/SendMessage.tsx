import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormHelperText,
  Input,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import GenericApiService from '../../service/GenericService';
import { useParams } from 'react-router-dom';
import MessageRequest from '../../dto/MessageRequest';
import MessageResponse from '../../dto/MessageResponse';
import Title from '../job/Header';

export default function SendMessage() {
  const [form, setForm] = useState({ message: '' });
  const { roomId, username } = useParams();
  const [alertMessage, setAlertMessage] = useState<string>();
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
        <Box width={'500px'}>
          {messages &&
            messages.map((message) => (
              <Box key={message.id}>
                <Box>{message.message}</Box>
                <Box fontSize={'0.6em'}>{message.usernameFrom}</Box>
                <Box>{message.createdDate.toString()}</Box>
                <Divider />
              </Box>
            ))}
          <FormControl>
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
