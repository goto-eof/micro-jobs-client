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
  Fade,
  ScaleFade,
  Skeleton,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import GenericService from '../service/GenericService';
import Job from '../dto/Job';
import GenericResponse from '../dto/GenericResponse';
import Pagination from './Pagination';
import PaginationUtil from '../util/PaginationUtil';

interface Props {
  baseUrl: string;
  urlCountItems: string;
}

export default function OffersRequests({ baseUrl, urlCountItems }: Props) {
  const [offers, setOffers] = useState<Array<Job>>(new Array<Job>());
  const [itemsCount, setItemsCount] = useState(0);
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    GenericService.getAll<Array<Job>>(baseUrl + '/0').then((data) => {
      GenericService.get<GenericResponse<number>>(urlCountItems).then(
        (genericResponse) => {
          setOffers(data);
          setItemsCount(genericResponse.value);
          setLoaded(true);
        }
      );
    });
  }, []);

  const goToPage = (page: number) => {
    GenericService.getAll<Array<Job>>(baseUrl + '/' + page).then((data) => {
      setOffers(data);
      window.scrollTo(0, 0);
    });
  };

  return (
    <>
      <Box>
        {offers &&
          offers.map((item, idx) => (
            <Offer
              key={idx}
              title={item.title}
              description={item.description}
            />
          ))}
      </Box>
      <Pagination
        callback={goToPage}
        numberOfPages={PaginationUtil.calculatePageNumber(itemsCount)}
      />
    </>
  );
}

interface Offer {
  title: string;
  description: string;
}

function Offer({ title, description }: Offer) {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      overflow="hidden"
      variant="outline"
    >
      <Skeleton width={{ base: '100%', sm: '200px' }} isLoaded={imageLoaded}>
        <Image
          objectFit="cover"
          maxW={{ base: '100%', sm: '200px' }}
          src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
          alt="Caffe Latte"
          onLoad={() => setImageLoaded(true)}
        />
      </Skeleton>
      <Stack>
        <CardBody>
          <Heading size="md">{title}</Heading>

          <Text py="2">{description}</Text>
        </CardBody>
        <CardFooter>
          <Button variant="solid" colorScheme="blue">
            Accept
          </Button>
        </CardFooter>
      </Stack>
    </Card>
  );
}
