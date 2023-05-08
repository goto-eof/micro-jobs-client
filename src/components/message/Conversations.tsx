import { useEffect, useState } from 'react';
import GenericService from '../../service/GenericService';
import { Box, Divider } from '@chakra-ui/react';
import Title from '../job/Header';
import Conversation from '../../dto/Room';
import { useNavigate } from 'react-router-dom';
import Room from '../../dto/Room';
import UserService from '../../service/UserService';

export default function Conversations() {
  const [rooms, setRooms] = useState<Array<Room>>();
  const navigate = useNavigate();
  useEffect(() => {
    GenericService.getAll<Array<Conversation>>(`api/v1/room`).then((data) => {
      setRooms(data);
    });
  }, []);

  const goToConversation = (room: Room) => {
    navigate(`/room/${room.id}`);
  };

  return (
    <>
      <Title title={'Conversations'} />
      <Box width={'500px'}>
        {rooms &&
          rooms.map((room) => (
            <Box key={room.title} onClick={() => goToConversation(room)}>
              <Box>{room.title}</Box>
              <Box>{room.description}</Box>
              <Box>
                {room.participants.filter(
                  (participant) => !UserService.isSameUsername(participant)
                )}
              </Box>
              <Divider />
            </Box>
          ))}
      </Box>
    </>
  );
}
