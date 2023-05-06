import { useEffect, useState } from 'react';
import GenericService from '../../service/GenericService';
import { Box, Divider } from '@chakra-ui/react';
import Title from '../job/Header';
import Conversation from '../../dto/Conversation';
import { useNavigate } from 'react-router-dom';

export default function Conversations() {
  const [conversations, setConversations] = useState<Array<Conversation>>();
  const navigate = useNavigate();
  useEffect(() => {
    GenericService.getAll<Array<Conversation>>(`api/v1/message`).then(
      (data) => {
        setConversations(data);
      }
    );
  }, []);

  const goToConversation = (conversation: Conversation) => {
    navigate(`/conversation/${conversation.userFromId}/${conversation.jobId}`);
  };

  return (
    <>
      <Title title={'Conversations'} />
      <Box width={'500px'}>
        {conversations &&
          conversations.map((conversation) => (
            <Box
              key={conversation.jobTitle}
              onClick={() => goToConversation(conversation)}
            >
              <Box>{conversation.jobTitle}</Box>
              <Box>{conversation.usernameTo}</Box>
              <Divider />
            </Box>
          ))}
      </Box>
    </>
  );
}
