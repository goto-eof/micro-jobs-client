import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  Text,
  Flex,
  Avatar,
  VStack,
  Textarea,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import GenericApiService from '../../service/GenericApiService';
import { useParams } from 'react-router-dom';
import MessageRequest from '../../dto/MessageRequest';
import MessageResponse from '../../dto/MessageResponse';
import Job from '../../dto/Job';
import UserService from '../../service/UserService';
import JobService from '../../service/JobService';

export default function SendMessage({ job }: { job?: Job }) {
  const [form, setForm] = useState({ message: '' });
  const { roomId } = useParams();
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

  return (
    <Box>
      {alertMessage && (
        <Alert status="error">
          <AlertIcon />
          {alertMessage}
        </Alert>
      )}
      <Center>
        <Box w={'full'}>
          {messages &&
            messages.map((message) => (
              <MessageItem
                align={loggedInUsername === message.username ? 'right' : 'left'}
                key={message.id}
                message={message}
              />
            ))}
          <FormControl mt={3}>
            <FormHelperText>Please write down your message</FormHelperText>
            <Textarea
              name="message"
              value={form.message}
              onChange={(e) => updateFormData(e)}
            />
          </FormControl>
          <Button onClick={() => sendMessage()} mt={2}>
            Send
          </Button>
        </Box>
      </Center>
    </Box>
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
    <Flex
      direction={{ base: 'column-reverse', md: 'row' }}
      rounded={'xl'}
      p={1}
      my={1}
      justifyContent={'space-between'}
      position={'relative'}
      bg={'white'}
    >
      <Box display={align === 'left' ? '' : 'none'}>
        {AvatarComponent(message)}
      </Box>
      <Flex
        direction={'column'}
        textAlign={align}
        justifyContent={'space-between'}
        w={'100%'}
        px={5}
      >
        <Box
          fontFamily={'Inter'}
          fontWeight={'medium'}
          fontSize={'15px'}
          pb={4}
        >
          <Box
            maxW={'400px'}
            float={align}
            boxShadow={'md'}
            padding={4}
            borderRadius={'md'}
          >
            <Text as={'span'} fontWeight={'bold'}>
              {message.username}
            </Text>
            : {message.message}
          </Box>
        </Box>
      </Flex>
      <Box display={align === 'right' ? '' : 'none'} verticalAlign={'bottom'}>
        {AvatarComponent(message)}
      </Box>
    </Flex>
  );
}
function AvatarComponent(message: MessageResponse) {
  return (
    <VStack
      display={{ base: 'none', md: 'block' }}
      alignContent={'center'}
      boxShadow={'md'}
      borderRadius={'10px'}
      p={2}
    >
      <Avatar
        src={JobService.getImageLink(message.pictureName)}
        height={'32px'}
        width={'32px'}
        margin={'auto'}
        alignSelf={'center'}
      />
    </VStack>
  );
}
