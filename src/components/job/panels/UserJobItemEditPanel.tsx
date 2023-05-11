import { Button } from '@chakra-ui/react';
import Job from '../../../dto/Job';
import UserService from '../../../service/UserService';
import { useState } from 'react';
import GenericApiService from '../../../service/GenericApiService';
import JobConst from '../../../consts/JobConst';
import { useNavigate } from 'react-router-dom';

interface UserJobItemEditPanelProps {
  job: Job;
  scope: string;
}
export default function UserJobItemEditPanel({
  job,
  scope,
}: UserJobItemEditPanelProps) {
  const [getCalculatedDisplayUserButtons] = useState<string>(
    scope === JobConst.SCOPE_PRIVATE &&
      UserService.isSameUsername(job.author?.username || '')
      ? ''
      : 'none'
  );

  const navigate = useNavigate();
  const goToEditOfferRequest = (job: Job) => {
    navigate(`/editJob/${scope}/jobId/${job.id}`);
  };

  const deleteItem = (job: Job | undefined) => {
    if (job && job.id) {
      GenericApiService.delete(`api/v1/job/${scope}/jobId`, job.id).then(
        (_) => {
          if (job && job.type === JobConst.TYPE_OFFER) {
            navigate('/myOffers');
          } else if (job && job.type === JobConst.TYPE_REQUEST) {
            navigate('/myRequests');
          }
        }
      );
    }
  };

  return (
    <>
      <Button
        variant={'solid'}
        colorScheme="red"
        mr={3}
        display={getCalculatedDisplayUserButtons}
        onClick={() => deleteItem(job)}
      >
        Delete
      </Button>
      <Button
        variant={'solid'}
        colorScheme="green"
        display={getCalculatedDisplayUserButtons}
        onClick={() => goToEditOfferRequest(job)}
      >
        Edit
      </Button>
    </>
  );
}
