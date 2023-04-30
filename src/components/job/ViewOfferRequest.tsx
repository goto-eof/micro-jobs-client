import { useEffect, useState } from 'react';
import GenericService from '../../service/GenericService';
import Job from '../../dto/Job';
import { Card, CardBody } from '@chakra-ui/card';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

interface Props {}
export default function ViewOfferRequest({}: Props) {
  const [job, setJob] = useState<Job>();
  let { id } = useParams();
  useEffect(() => {
    GenericService.get<Job>('api/v1/job/' + id).then((job) => {
      setJob(job);
    });
  }, []);

  return (
    <Card>
      <CardBody>
        <Text>ID: {job && job.id}</Text>
        <Text>Title: {job && job.title}</Text>
        <Text>Description: {job && job.description}</Text>
        <Text>Status: {job && job.status}</Text>
        <Text>Type: {job && job.type}</Text>
        <Flex>
          {job &&
            job.pictureNamesList &&
            job.pictureNamesList.map((image, idx) => (
              <Box key={idx} w={'64px'} h={'64px'}>
                <img src={'/api/v1/jobPicture/files/' + image} />
              </Box>
            ))}
        </Flex>
      </CardBody>
    </Card>
  );
}
