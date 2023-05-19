import JobInstanceConst from '../consts/JobInstanceConst';

export default class JobInstanceService {
  static retrieveHumanableStatus(code: number) {
    switch (code) {
      case JobInstanceConst.STATUS_CREATED: {
        return 'CREATED';
      }
      case JobInstanceConst.STATUS_WORKER_WORK_REQUEST: {
        return 'WORK REQUEST SENT';
      }
      case JobInstanceConst.STATUS_WORK_PROVIDER_WORK_REQUEST_ACCEPT: {
        return 'WORK REQUEST ACCEPTED';
      }
      case JobInstanceConst.STATUS_WORKER_WORK_START: {
        return 'WORK STARTED';
      }
      case JobInstanceConst.STATUS_WORKER_WORK_END: {
        return 'WORK ENDED';
      }
      case JobInstanceConst.STATUS_WORK_PROVIDER_WORK_RECEIVED: {
        return 'WORK RECEIVED BY CUSTOMER';
      }
      case JobInstanceConst.STATUS_WORK_PROVIDER_WORK_APPROVE: {
        return 'CUSTOMER APPROVED WORK';
      }
      case JobInstanceConst.STATUS_WORK_PROVIDER_PAYMENT: {
        return 'CUSTOMER PAYED WORKER';
      }
      case JobInstanceConst.STATUS_WORKER_RECEIVED_PAYMENT: {
        return 'Worker received payment';
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
