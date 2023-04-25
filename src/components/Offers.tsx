import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  Image,
  Text,
  Box,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import GenericService from '../service/GenericService';
import Job from '../dto/Job';

export default function Offers() {
  const [offers, setOffers] = useState<Array<Job>>(new Array<Job>());

  useEffect(() => {
    GenericService.getAll<Array<Job>>('job/offers/0').then((data) => {
      console.log(data);
      setOffers(data);
    });
  }, []);

  return (
    <Box>
      {offers &&
        offers.map((item, idx) => (
          <Offer key={idx} title={item.title} description={item.description} />
        ))}
    </Box>
  );
}

interface Offer {
  title: string;
  description: string;
}

function Offer({ title, description }: Offer) {
  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      overflow="hidden"
      variant="outline"
    >
      <Image
        objectFit="cover"
        maxW={{ base: '100%', sm: '200px' }}
        src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
        alt="Caffe Latte"
      />

      <Stack>
        <CardBody>
          <Heading size="md">{title}</Heading>

          <Text py="2">{description}</Text>
        </CardBody>

        <CardFooter>
          <Button variant="solid" colorScheme="blue">
            {title}
          </Button>
        </CardFooter>
      </Stack>
    </Card>
  );
}
