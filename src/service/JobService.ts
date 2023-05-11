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
      case JobConst.STATUS_UPDATED: {
        return 'UPDATED';
      }
      case JobConst.STATUS_UNPUBLISHED: {
        return 'UNPUBLISHED';
      }
      default: {
        return 'UKNOWN';
      }
    }
  }
  static isCreated(status: number | undefined) {
    return status === JobConst.STATUS_CREATED;
  }
  static isUpdated(status: number | undefined) {
    return status === JobConst.STATUS_UPDATED;
  }
  static isPublished(status: number | undefined) {
    return status === JobConst.STATUS_PUBLISHED;
  }
  static isUnpublished(status: number | undefined) {
    return status === JobConst.STATUS_UNPUBLISHED;
  }
  public static calulateAcceptButtonLabel = (job: Job) => {
    if (job.type === JobConst.TYPE_OFFER) {
      return 'Request service';
    }
    if (job.type === JobConst.TYPE_REQUEST) {
      return 'Provide service';
    }
    return 'ERROR';
    // throw new Error('Function not implemented.');
  };

  public static retrieveMainJobPicture(job: Job | undefined) {
    if (
      job &&
      job.jobPictureList &&
      job.jobPictureList.length > 0 &&
      job.jobPictureList[0]
    ) {
      return job.jobPictureList[0].pictureName;
    }
    return '';
  }

  public static hasMainJobPicture(job: Job | undefined) {
    return (
      job &&
      job.jobPictureList &&
      job.jobPictureList.length > 0 &&
      job.jobPictureList[0]
    );
  }

  public static getImageLink(pictureName: string | undefined): string {
    if (pictureName) {
      return `/api/v1/jobPicture/files/${pictureName}`;
    }
    return '#';
  }
}
