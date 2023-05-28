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
import Message from '../../dto/Message';
import MessagePost from '../../dto/MessagePost';

export default function SendMessage({ job }: { job?: Job }) {
  const [form, setForm] = useState({ message: '' });
  const { roomId } = useParams();
  const [offset, setOffset] = useState<number>(10);
  const [lastOffset, setLastOffset] = useState<number>(0);
  const [alertMessage, setAlertMessage] = useState<string>();
  const [loggedInUsername] = useState<String>(UserService.getUsername());
  const [messages, setMessages] = useState<Array<Message>>(
    new Array<Message>()
  );

  useEffect(() => {
    GenericApiService.createDifResponse<MessageRequest, MessageResponse>(
      `api/v1/room/message/roomId/${roomId}`,
      {
        offsetRequest: offset,
        lastOffset: lastOffset,
        roomId: Number(roomId) || -1,
      }
    ).then(
      (data: MessageResponse) => {
        setMessages(data.messages);
        setLastOffset(offset);
        setOffset(data.nextOffset);
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
    if (!!!form.message) {
      return;
    }
    GenericApiService.createDifResponse<MessagePost, Message>(
      `api/v1/room/message`,
      {
        message: form.message,
        roomId: Number(roomId),
      }
    ).then(
      (data: Message) => {
        const newMessages: Array<Message> = [...messages, data];
        setMessages(newMessages);
        setForm({ ...form, message: '' });
      },
      (err: any) => {
        setAlertMessage(err.response.data.message);
        window.scroll(0, 0);
      }
    );
  };

  const loadOldestMessages = () => {
    GenericApiService.createDifResponse<MessageRequest, MessageResponse>(
      `api/v1/room/message/roomId/${roomId}`,
      {
        offsetRequest: offset,
        lastOffset: lastOffset,
        roomId: Number(roomId) || -1,
      }
    ).then(
      (data: MessageResponse) => {
        const msgs = [...data.messages, ...messages];
        setMessages(msgs);
        setLastOffset(offset);
        setOffset(data.nextOffset);
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
        <VStack w={'full'}>
          <Button
            display={offset == -1 ? 'none' : ''}
            onClick={() => loadOldestMessages()}
          >
            Load oldest
          </Button>
          <Box w={'full'}>
            {messages &&
              messages.map((message) => (
                <MessageItem
                  align={
                    loggedInUsername === message.username ? 'right' : 'left'
                  }
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
            <Center>
              <Button
                colorScheme="blue"
                onClick={() => sendMessage()}
                mt={2}
                px={'50px'}
              >
                Send
              </Button>
            </Center>
          </Box>
        </VStack>
      </Center>
    </Box>
  );
}

function MessageItem({ message, align }: { message: Message; align: any }) {
  return (
    <Flex
      direction={{ base: 'column-reverse', md: 'row' }}
      rounded={'xl'}
      p={1}
      my={1}
      justifyContent={'space-between'}
      position={'relative'}
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
function AvatarComponent(message: Message) {
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
