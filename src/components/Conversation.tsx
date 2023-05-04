import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GenericService from '../service/GenericService';
import Message from '../dto/Message';

export default function Conversation() {
  let { userTargetId } = useParams();

  useEffect(() => {
    GenericService.getAll<Array<Message>>(`api/v1/message`);
  }, []);

  return <Box>{userTargetId}</Box>;
}
