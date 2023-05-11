import { Button } from '@chakra-ui/react';
import Job from '../../../dto/Job';
import UserService from '../../../service/UserService';
import JobService from '../../../service/JobService';
import { useState } from 'react';

interface UserJobItemPanelProps {
  job: Job;
}
export default function UserJobItemPanel({ job }: UserJobItemPanelProps) {
  const [showAcceptJobButton] = useState<boolean>(
    !!job.author &&
      !!job.author.username &&
      !UserService.isSameUsername(job.author.username) &&
      !UserService.isAdmin()
  );
  const [acceptJobButtonLabel] = useState<string>(
    JobService.calulateAcceptButtonLabel(job)
  );

  return (
    <>
      <Button
        display={showAcceptJobButton ? '' : 'none'}
        mr={3}
        variant="solid"
        colorScheme="blue"
      >
        {acceptJobButtonLabel}
      </Button>
    </>
  );
}
