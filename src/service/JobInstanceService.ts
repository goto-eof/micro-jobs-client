import JobInstanceConst from '../consts/JobInstanceConst';

export default class JobInstanceService {
  static retrieveHumanableStatus(code: number) {
    switch (code) {
      case JobInstanceConst.STATUS_CREATED: {
        return 'CREATED';
      }
      case JobInstanceConst.STATUS_CUSTOMER_WORK_REQUEST: {
        return 'WORK REQUEST SENT';
      }
      case JobInstanceConst.STATUS_PROVIDER_WORK_ACCEPT: {
        return 'WORK REQUEST ACCEPTED';
      }
      case JobInstanceConst.STATUS_WORKER_WORK_START: {
        return 'WORK STARTED';
      }
      case JobInstanceConst.STATUS_WORKER_WORK_END: {
        return 'WORK ENDED';
      }
      case JobInstanceConst.STATUS_CUSTOMER_RECEIVES_WORK: {
        return 'WORK RECEIVED BY CUSTOMER';
      }
      case JobInstanceConst.STATUS_CUSTOMER_ACCEPTS_WORK: {
        return 'CUSTOMER APPROVED WORK';
      }
      case JobInstanceConst.STATUS_CUSTOMER_PAYS_WORKER: {
        return 'CUSTOMER PAYED WORKER';
      }
      case JobInstanceConst.STATUS_PROCESS_COMPLETE: {
        return 'PROCESS COMPLETE';
      }
      default: {
        return 'UKNOWN';
      }
    }
  }
}
