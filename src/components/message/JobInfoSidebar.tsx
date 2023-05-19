import React, { ReactNode, useEffect, useState } from 'react';
import {
  Box,
  useColorModeValue,
  Text,
  BoxProps,
  Image,
  Center,
  VStack,
} from '@chakra-ui/react';
import Job from '../../dto/Job';
import GenericApiService from '../../service/GenericApiService';
import JobService from '../../service/JobService';
import { useParams } from 'react-router-dom';
import SendMessage from './SendMessage';
import Title from '../job/Header';
import UserJobItemPanel from '../job/panels/UserJobItemPanel';

export default function JobInfoSidebar() {
  const { roomId } = useParams();
  const [job, setJob] = useState<Job>();
  const [jobPictureLink, setJobPictureLink] = useState<string>();
  const [workerId, setWorkerId] = useState<number>(-1);
  useEffect(() => {
    GenericApiService.get<Job>(`api/v1/job/private/roomId/${roomId}`).then(
      (job: Job) => {
        GenericApiService.get<number>(
          `api/v1/room/getWorkerId/roomId/${roomId}`
        ).then((workerId: number) => {
          setJob(job);
          setJobPictureLink(JobService.getImageLink(job?.picture));
          setWorkerId(workerId);
        });
      }
    );
  }, []);

  return (
    <Box minH="100vh" bg={useColorModeValue('white.100', 'white.900')}>
      <SidebarContent
        display={{ base: 'none', md: 'block' }}
        job={job}
        jobPictureLink={jobPictureLink}
        workerId={workerId}
      />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Title title={'Conversation: ' + job?.title} />
        <Box
          display={{ base: 'block', md: 'none' }}
          boxShadow={'md'}
          borderRadius={'md'}
          p={2}
          m={2}
        >
          <Center>
            <VStack>
              {<Image w={'300px'} src={jobPictureLink} />}
              <Text>
                {job?.title} (by @{job?.author?.username})
              </Text>
              <Text>{job?.description}</Text>
            </VStack>
          </Center>
        </Box>
        <SendMessage job={job} />
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  job?: Job;
  jobPictureLink?: string;
  workerId: number;
}

const SidebarContent = ({
  job,
  workerId,
  jobPictureLink,
  ...rest
}: SidebarProps) => {
  return (
    <Box w={{ base: 'full', md: 60 }} mt={4} p={3} pos={'absolute'} {...rest}>
      <Center>
        <VStack>
          {<Image w={'600px'} src={jobPictureLink} />}
          <Text fontSize="sm" fontFamily="monospace" fontWeight="bold"></Text>
          <Text>{job?.title}</Text>
          <Text fontSize={'0.6em'}>
            by {job?.author?.firstname} {job?.author?.lastname} [@
            {job?.author?.username}]
          </Text>
          <Text>{job?.description}</Text>
          {job && <UserJobItemPanel workerId={workerId} job={job} />}
        </VStack>
      </Center>
    </Box>
  );
};
