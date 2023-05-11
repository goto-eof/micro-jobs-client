import { useEffect, useState } from 'react';
import GenericApiService from '../../service/GenericService';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Stack,
  Text,
  Image,
} from '@chakra-ui/react';
import Title from '../job/Header';
import Conversation from '../../dto/Room';
import { useNavigate } from 'react-router-dom';
import Room from '../../dto/Room';
import UserService from '../../service/UserService';
import JobService from '../../service/JobService';

export default function Conversations() {
  const [rooms, setRooms] = useState<Array<Room>>();

  useEffect(() => {
    GenericApiService.getAll<Array<Conversation>>(`api/v1/room`).then(
      (data) => {
        setRooms(data);
      }
    );
  }, []);

  return (
    <>
      <Title title={'Conversations'} />
      {rooms && rooms.map((room, idx) => <RoomItem key={idx} room={room} />)}
    </>
  );
}

interface RoomItemProps {
  room: Room;
}

function RoomItem({ room }: RoomItemProps) {
  const [roomPicture] = useState<string>(
    JobService.getImageLink(room.pictureName)
  );
  const [to] = useState<string>(
    room.participants.filter(
      (participant) => !UserService.isSameUsername(participant)
    )[0]
  );
  const navigate = useNavigate();
  const goToConversation = (room: Room) => {
    const participant = room.participants.filter(
      (part) => !UserService.isSameUsername(part)
    );
    navigate(`/room/${room.id}/username/${participant}`);
  };
  return (
    <Card
      size={'sm'}
      direction={{ base: 'column', sm: 'row' }}
      overflow="hidden"
      variant="outline"
    >
      <Image
        objectFit="cover"
        maxW={{ base: '100%', sm: '50px' }}
        src={roomPicture}
        alt="Caffe Latte"
      />

      <Stack>
        <CardBody>
          <Heading
            size="md"
            cursor={'pointer'}
            userSelect={'none'}
            onClick={() => goToConversation(room)}
            color={'blue.400'}
          >
            Conversation with @{to}
          </Heading>
          <Text> {room.title}</Text>
          <Text py="0">{room.description}</Text>
        </CardBody>

        <CardFooter></CardFooter>
      </Stack>
    </Card>
  );
}
