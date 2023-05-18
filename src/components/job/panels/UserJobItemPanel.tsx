import { Button, Text } from '@chakra-ui/react';
import Job from '../../../dto/Job';
import UserService from '../../../service/UserService';
import JobService from '../../../service/JobService';
import { useEffect, useState } from 'react';
import GenericApiService from '../../../service/GenericApiService';
import JobInstance from '../../../dto/JobInstance';
import JobInstanceService from '../../../service/JobInstanceService';

interface UserJobItemPanelProps {
  job: Job;
}
export default function UserJobItemPanel({ job }: UserJobItemPanelProps) {
  const [showAcceptJobButton, setShowAcceptJobButton] = useState<boolean>(
    !!job.author &&
      !!job.author.username &&
      !UserService.isSameUsername(job.author.username) &&
      !UserService.isAdmin()
  );
  const [acceptJobButtonLabel] = useState<string>(
    JobService.calulateAcceptButtonLabel(job)
  );
  const [jobInstanceStatus, setJobInstanceStatus] = useState<string>('');

  useEffect(() => {
    const jobId = job.id;
    const customerId = job.author?.id;
    GenericApiService.get<JobInstance>(
      `api/v1/jobInstance/private/jobId/${jobId}/customerId/${customerId}`
    ).then((jobInstance: JobInstance) => {
      if (jobInstance === null) {
        // it's ok
        return;
      }
      setShowAcceptJobButton(false);
      setJobInstanceStatus(
        JobInstanceService.retrieveHumanableStatus(jobInstance.status)
      );
    });
  }, []);

  const requestForWork = () => {
    const jobId = job.id;
    const customerId = job.author?.id;
    GenericApiService.postWithouthBody<JobInstance>(
      `api/v1/jobInstance/private/jobId/${jobId}/customerId/${customerId}`
    ).then((jobInstance: JobInstance) => {
      setShowAcceptJobButton(false);
      setJobInstanceStatus(
        JobInstanceService.retrieveHumanableStatus(jobInstance.status)
      );
    });
  };

  return (
    <>
      {showAcceptJobButton && (
        <Button
          mr={3}
          variant="solid"
          colorScheme="blue"
          onClick={() => requestForWork()}
        >
          {acceptJobButtonLabel}
        </Button>
      )}
      {!showAcceptJobButton && (
        <Text fontWeight={'bold'}>
          status:{' '}
          <Text as={'span'} color={'green.400'}>
            {' '}
            {jobInstanceStatus}
          </Text>
        </Text>
      )}
    </>
  );
}
