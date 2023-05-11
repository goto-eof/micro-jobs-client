import React, { ReactNode, useEffect, useState } from 'react';
import {
  Box,
  useColorModeValue,
  Text,
  BoxProps,
  Image,
} from '@chakra-ui/react';
import Job from '../../dto/Job';
import GenericApiService from '../../service/GenericApiService';
import JobService from '../../service/JobService';
import { useParams } from 'react-router-dom';
import SendMessage from './SendMessage';

export default function JobInfoSidebar({ children }: { children?: ReactNode }) {
  const { roomId } = useParams();
  const [job, setJob] = useState<Job>();
  useEffect(() => {
    GenericApiService.get<Job>(`api/v1/job/private/roomId/${roomId}`).then(
      (job: Job) => {
        setJob(job);
      }
    );
  }, []);

  return (
    <Box minH="100vh" bg={useColorModeValue('white.100', 'white.900')}>
      <SidebarContent display={{ base: 'none', md: 'block' }} job={job} />
      <Text display={{ base: 'block', md: 'none' }}>Ciao</Text>
      <Box ml={{ base: 0, md: 60 }} p="4">
        <SendMessage job={job} />
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  job?: Job;
}

const SidebarContent = ({ job, ...rest }: SidebarProps) => {
  return (
    <Box w={{ base: 'full', md: 60 }} pos={'absolute'} {...rest}>
      {<Image maxW={'200px'} src={JobService.getImageLink(job?.picture)} />}
      <Text fontSize="sm" fontFamily="monospace" fontWeight="bold"></Text>
      <Text>
        {job?.author?.firstname} {job?.author?.lastname} [@
        {job?.author?.username}]
      </Text>
      <Text>{job?.title}</Text>
      <Text>{job?.description}</Text>
    </Box>
  );
};
