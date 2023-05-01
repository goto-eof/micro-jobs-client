import JobConst from '../consts/JobConst';
import Job from '../dto/Job';

export default class JobService {
  static isCreated(status: number | undefined) {
    return status === JobConst.STATUS_CREATED;
  }
  public static calulateAcceptButtonLabel = (job: Job) => {
    if (job.type === JobConst.TYPE_OFFER) {
      return 'Request service';
    }
    if (job.type === JobConst.TYPE_REQUEST) {
      return 'Provide service';
    }
    return 'TEST';
    // throw new Error('Function not implemented.');
  };
}
