import { Button } from '@chakra-ui/react';
import Job from '../../../dto/Job';
import UserService from '../../../service/UserService';
import JobService from '../../../service/JobService';
import { useState } from 'react';
import GenericApiService from '../../../service/GenericApiService';
import JobConst from '../../../consts/JobConst';

interface AdminPanelProps {
  job: Job;
  approveCallback?: (job: Job) => void;
  scope: string;
}

export default function AdminJobItemPanel({
  job,
  approveCallback,
  scope,
}: AdminPanelProps) {
  const approve = (): void => {
    GenericApiService.postWithouthBody<Job>(
      'api/v1/job/private/approve/jobId/' + job.id
    ).then((job) => {
      approveCallback && approveCallback(job);
    });
  };
  const unpublish = (): void => {
    GenericApiService.postWithouthBody<Job>(
      'api/v1/job/private/unpublish/jobId/' + job.id
    ).then((job) => {
      approveCallback && approveCallback(job);
    });
  };
  const [isAdmin] = useState<boolean>(UserService.isAdmin());
  const [isValidJobStatusForApproval] = useState<boolean>(
    (scope === JobConst.SCOPE_PRIVATE && JobService.isCreated(job.status)) ||
      JobService.isUpdated(job.status) ||
      JobService.isUnpublished(job.status)
  );
  const [isValidStatusForUnpublish] = useState<boolean>(
    JobService.isPublished(job.status)
  );

  return (
    <>
      {adminJobItemPanel(
        isAdmin,
        isValidJobStatusForApproval,
        isValidStatusForUnpublish,
        approve,
        unpublish
      )}
    </>
  );
}

function adminJobItemPanel(
  isAdmin: boolean,
  isValidJobStatusForApproval: boolean,
  isValidStatusForUnpublish: boolean,
  approve: () => void,
  unpublish: () => void
) {
  return (
    isAdmin && (
      <>
        {isValidJobStatusForApproval && (
          <Button
            mr={3}
            variant="solid"
            colorScheme="blue"
            onClick={() => approve()}
          >
            Approve
          </Button>
        )}
        {isValidStatusForUnpublish && (
          <Button
            mr={3}
            variant="solid"
            colorScheme="blue"
            onClick={() => unpublish()}
          >
            Unpublish
          </Button>
        )}
      </>
    )
  );
}
