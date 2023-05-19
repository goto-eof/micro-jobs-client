export default class JobInstanceConst {
  static readonly STATUS_CREATED = 0;
  static readonly STATUS_WORKER_WORK_REQUEST = 10;
  static readonly STATUS_WORK_PROVIDER_WORK_REQUEST_ACCEPT = 20;
  static readonly STATUS_WORKER_WORK_START = 30;
  static readonly STATUS_WORKER_WORK_END = 40;
  static readonly STATUS_WORK_PROVIDER_WORK_RECEIVED = 50;
  static readonly STATUS_WORK_PROVIDER_WORK_APPROVE = 60;
  static readonly STATUS_WORK_PROVIDER_PAYMENT = 70;
  static readonly STATUS_WORKER_RECEIVED_PAYMENT = 80;
  static readonly STATUS_PROCESS_COMPLETE = 70;
}
