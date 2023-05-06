import Author from './Author';

export default interface MessageRequest {
  userToId: number;
  message: string;
  jobId: number;
}
