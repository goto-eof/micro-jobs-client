import { StarIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import GenericApiService from '../service/GenericApiService';
import Rating from '../dto/Rating';
import JobInstance from '../dto/JobInstance';

export default function RateUser({
  targetUserId,
  raterUserId,
  jobInstanceProp,
}: {
  raterUserId: number;
  targetUserId: number;
  jobInstanceProp: JobInstance;
}) {
  const [enabled, setEnabled] = useState<Array<boolean>>(
    Array.from(Array(5).keys()).map(() => false)
  );
  const updateColors = (id: number) => {
    setEnabled(enabled.map((_, idx) => (idx <= id ? true : false)));
  };
  const [rating, setRating] = useState<Rating | null>();
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [jobInstance, setJobInstance] = useState<JobInstance>();

  useEffect(() => {
    setJobInstance(jobInstanceProp);
    GenericApiService.get<Rating>(
      `api/v1/rating/jobInstanceId/${jobInstanceProp.id}/targetUserId/${targetUserId}`
    ).then((rating: Rating | null) => {
      setRating(rating);
      if (rating) {
        setRatingValue(rating?.rating - 1);
        updateColors(rating?.rating - 1);
      }
    });
  }, []);

  const vote = (idx: number) => {
    const newRating: Rating = {
      id: rating?.id,
      comment: '',
      jobInstanceId: jobInstance?.id,
      rating: idx + 1,
      userTargetId: targetUserId,
      userVoterId: raterUserId,
    };
    GenericApiService.create<Rating>(`api/v1/rating`, newRating).then(
      (rating: Rating) => {
        setRating(rating);
        if (rating) {
          setRatingValue(rating?.rating - 1);
          updateColors(rating?.rating - 1);
        }
      }
    );
  };
  const doNothing = () => {
    console.log('do nothing');
  };
  return (
    <Box as="span">
      {enabled.map((_, idx) => {
        return (
          <StarIcon
            onMouseOver={() => {
              ratingValue === 0 ? updateColors(idx) : doNothing();
            }}
            onClick={() => vote(idx)}
            key={idx}
            color={enabled[idx] ? 'yellow.300' : 'gray.300'}
          />
        );
      })}
    </Box>
  );
}
