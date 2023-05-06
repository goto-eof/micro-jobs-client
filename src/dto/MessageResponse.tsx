import Author from './Author';

export default interface MessageResponse {
  id: number;
  usernameFrom: string;
  usernameTo: string;
  message: string;
  date: Date;
}
