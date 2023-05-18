export default class JobInstanceConst {
  static readonly STATUS_CREATED = 0;
  static readonly STATUS_CUSTOMER_WORK_REQUEST = 10;
  static readonly STATUS_PROVIDER_WORK_ACCEPT = 15;
  static readonly STATUS_WORKER_WORK_START = 20;
  static readonly STATUS_WORKER_WORK_END = 30;
  static readonly STATUS_CUSTOMER_RECEIVES_WORK = 40;
  static readonly STATUS_CUSTOMER_ACCEPTS_WORK = 50;
  static readonly STATUS_CUSTOMER_PAYS_WORKER = 60;
  static readonly STATUS_PROCESS_COMPLETE = 70;
}
