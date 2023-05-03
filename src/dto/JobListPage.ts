import Job from './Job';

export default interface JobListPage {
  jobList: Array<Job>;
  totalItems: number;
}
