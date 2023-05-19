import { Button, Text } from '@chakra-ui/react';
import Job from '../../../dto/Job';
import UserService from '../../../service/UserService';
import JobService from '../../../service/JobService';
import { useEffect, useState } from 'react';
import GenericApiService from '../../../service/GenericApiService';
import JobInstance from '../../../dto/JobInstance';
import JobInstanceService from '../../../service/JobInstanceService';
import JobInstanceConst from '../../../consts/JobInstanceConst';

interface UserJobItemPanelProps {
  job: Job;
  workerId: number;
}
export default function UserJobItemPanel({
  job,
  workerId,
}: UserJobItemPanelProps) {
  const [acceptJobButtonLabel] = useState<string>(
    JobService.calulateAcceptButtonLabel(job)
  );
  const [jobInstance, setJobInstance] = useState<JobInstance>();
  const [jobInstanceStatus, setJobInstanceStatus] = useState<string>('');

  useEffect(() => {
    const jobId = job.id;
    GenericApiService.get<JobInstance>(
      `api/v1/jobInstance/private/jobId/${jobId}/workerId/${workerId}`
    ).then((jobInstance: JobInstance) => {
      if (jobInstance === null) {
        // it's ok
        return;
      }
      setJobInstance(jobInstance);
      setJobInstanceStatus(
        JobInstanceService.retrieveHumanableStatus(jobInstance.status)
      );
    });
  }, []);

  /*************** [Worker] ****************/

  const changeWorkerJobInstanceStatus = (
    jobId: number,
    jobInstanceStatus: number
  ) => {
    GenericApiService.postWithouthBody<JobInstance>(
      `api/v1/jobInstance/private/jobId/${jobId}/jobInstanceStatus/${jobInstanceStatus}`
    ).then((jobInstance: JobInstance) => {
      setJobInstanceStatus(
        JobInstanceService.retrieveHumanableStatus(jobInstance.status)
      );
    });
  };

  const requestForWork = () => {
    job.id &&
      changeWorkerJobInstanceStatus(
        job.id,
        JobInstanceConst.STATUS_WORKER_WORK_REQUEST
      );
  };

  const startWork = () => {
    job.id &&
      changeWorkerJobInstanceStatus(
        job.id,
        JobInstanceConst.STATUS_WORKER_WORK_START
      );
  };

  const endWork = () => {
    job.id &&
      changeWorkerJobInstanceStatus(
        job.id,
        JobInstanceConst.STATUS_WORKER_WORK_END
      );
  };

  const workerReceivedPaymentConfirmation = () => {
    job.id &&
      changeWorkerJobInstanceStatus(
        job.id,
        JobInstanceConst.STATUS_WORKER_RECEIVED_PAYMENT
      );
  };

  /*************** [Work provider] ****************/
  function changeWorkProviderJobInstanceStatus(
    jobId: number,
    jobInstanceStatus: number,
    workerId: number
  ) {
    GenericApiService.postWithouthBody<JobInstance>(
      `api/v1/jobInstance/private/jobId/${jobId}/workerId/${workerId}/jobInstanceStatus/${jobInstanceStatus}`
    ).then((jobInstance: JobInstance) => {
      setJobInstanceStatus(
        JobInstanceService.retrieveHumanableStatus(jobInstance.status)
      );
    });
  }
  const acceptWorkRequest = () => {
    job.id &&
      changeWorkProviderJobInstanceStatus(
        job.id,
        JobInstanceConst.STATUS_WORK_PROVIDER_WORK_REQUEST_ACCEPT,
        workerId
      );
  };

  const workProviderWorkReceived = () => {
    job.id &&
      changeWorkProviderJobInstanceStatus(
        job.id,
        JobInstanceConst.STATUS_WORK_PROVIDER_WORK_RECEIVED,
        workerId
      );
  };

  const workProviderWorkApprove = () => {
    job.id &&
      changeWorkProviderJobInstanceStatus(
        job.id,
        JobInstanceConst.STATUS_WORK_PROVIDER_WORK_APPROVE,
        workerId
      );
  };

  const workProviderPayWorker = () => {
    job.id &&
      changeWorkProviderJobInstanceStatus(
        job.id,
        JobInstanceConst.STATUS_WORK_PROVIDER_PAYMENT,
        workerId
      );
  };

  /********************** [Work provider] ************************/

  const isWorkProvider =
    !!job.author &&
    !!job.author.username &&
    UserService.isSameUsername(job.author.username) &&
    !UserService.isAdmin();

  const showWorkProviderAcceptWorkRequest =
    isWorkProvider &&
    jobInstance?.status === JobInstanceConst.STATUS_WORKER_WORK_REQUEST;

  const showWorkProviderWorkReceived =
    isWorkProvider &&
    jobInstance?.status === JobInstanceConst.STATUS_WORKER_WORK_END;

  const showWorkProviderWorkApprove =
    isWorkProvider &&
    jobInstance?.status === JobInstanceConst.STATUS_WORK_PROVIDER_WORK_RECEIVED;

  const showWorkProviderPayWorker =
    isWorkProvider &&
    jobInstance?.status === JobInstanceConst.STATUS_WORK_PROVIDER_WORK_APPROVE;

  /********************** [Worker] ************************/

  const isWorker =
    !!job.author &&
    !!job.author.username &&
    !UserService.isSameUsername(job.author.username) &&
    !UserService.isAdmin();

  const showAcceptWorkButton =
    isWorker && jobInstance?.status === JobInstanceConst.STATUS_CREATED;

  const showWorkStartButton =
    isWorker &&
    jobInstance?.status ===
      JobInstanceConst.STATUS_WORK_PROVIDER_WORK_REQUEST_ACCEPT;

  const showWorkEndButton =
    isWorker &&
    jobInstance?.status === JobInstanceConst.STATUS_WORKER_WORK_START;

  const showWorkerReceivedPaymentConfirmation =
    isWorker &&
    jobInstance?.status === JobInstanceConst.STATUS_WORK_PROVIDER_PAYMENT;

  return (
    <>
      <Text fontWeight={'bold'}>
        status:{' '}
        <Text as={'span'} color={'green.400'}>
          {jobInstanceStatus}
        </Text>
      </Text>

      {showAcceptWorkButton && (
        <Button
          mr={3}
          variant="solid"
          colorScheme="blue"
          onClick={() => requestForWork()}
        >
          {acceptJobButtonLabel}
        </Button>
      )}

      {showWorkProviderAcceptWorkRequest && (
        <Button
          onClick={() => {
            acceptWorkRequest();
          }}
        >
          Accept work request
        </Button>
      )}

      {showWorkStartButton && (
        <Button
          onClick={() => {
            startWork();
          }}
        >
          Start work
        </Button>
      )}

      {showWorkEndButton && (
        <Button
          onClick={() => {
            endWork();
          }}
        >
          End work
        </Button>
      )}

      {showWorkProviderWorkReceived && (
        <Button
          onClick={() => {
            workProviderWorkReceived();
          }}
        >
          Work received
        </Button>
      )}

      {showWorkProviderWorkApprove && (
        <Button
          onClick={() => {
            workProviderWorkApprove();
          }}
        >
          Approve work
        </Button>
      )}

      {showWorkProviderPayWorker && (
        <Button
          onClick={() => {
            workProviderPayWorker();
          }}
        >
          Pay worker
        </Button>
      )}

      {showWorkerReceivedPaymentConfirmation && (
        <Button
          onClick={() => {
            workerReceivedPaymentConfirmation();
          }}
        >
          Confirm payment received
        </Button>
      )}
    </>
  );
}
