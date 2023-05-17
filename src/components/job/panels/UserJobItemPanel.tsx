import { Button } from '@chakra-ui/react';
import Job from '../../../dto/Job';
import UserService from '../../../service/UserService';
import JobService from '../../../service/JobService';
import { useEffect, useState } from 'react';
import GenericApiService from '../../../service/GenericApiService';
import JobInstance from '../../../dto/JobInstance';

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
    });
  }, []);

  const requestForWork = () => {
    const jobId = job.id;
    const customerId = job.author?.id;
    GenericApiService.postWithouthBody<JobInstance>(
      `api/v1/jobInstance/private/jobId/${jobId}/customerId/${customerId}`
    ).then((jobInstance: JobInstance) => {
      setShowAcceptJobButton(false);
    });
  };

  return (
    <>
      <Button
        display={showAcceptJobButton ? '' : 'none'}
        mr={3}
        variant="solid"
        colorScheme="blue"
        onClick={() => requestForWork()}
      >
        {acceptJobButtonLabel}
      </Button>
    </>
  );
}
