import JobConst from '../consts/JobConst';
import Job from '../dto/Job';

export default class JobService {
  static retrieveStatus(job: Job): string {
    switch (job.status) {
      case JobConst.STATUS_CREATED: {
        return 'CREATED';
      }
      case JobConst.STATUS_PUBLISHED: {
        return 'PUBLISHED';
      }
      default: {
        return 'UKNOWN';
      }
    }
  }
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
