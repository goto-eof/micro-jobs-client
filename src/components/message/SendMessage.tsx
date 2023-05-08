import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormHelperText,
  Input,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import GenericService from '../../service/GenericService';
import { useParams } from 'react-router-dom';
import MessageRequest from '../../dto/MessageRequest';
import MessageResponse from '../../dto/MessageResponse';

export default function SendMessage() {
  const [form, setForm] = useState({ message: '' });
  const { roomId } = useParams();
  const [messages, setMessages] = useState<Array<MessageResponse>>(
    new Array<MessageResponse>()
  );

  useEffect(() => {
    GenericService.getAll<Array<MessageResponse>>(
      `api/v1/room/message/roomId/${roomId}`
    ).then((data: Array<MessageResponse>) => {
      setMessages(data);
    });
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
    GenericService.createDifResponse<MessageRequest, MessageResponse>(
      `api/v1/room/message`,
      {
        message: form.message,
        roomId: Number(roomId),
      }
    ).then((data: MessageResponse) => {
      const newMessages: Array<MessageResponse> = [...messages, data];
      setMessages(newMessages);
      setForm({ ...form, message: '' });
    });
  };

  return (
    <>
      <Center>
        <Box width={'500px'}>
          {messages &&
            messages.map((message) => (
              <Box key={message.id}>
                <Box>{message.message}</Box>
                <Box fontSize={'0.6em'}>{message.usernameFrom}</Box>
                {/* <Box fontSize={'0.5em'}>{message.date.toString()}</Box> */}
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
