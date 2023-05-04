import Author from './Author';

export default interface Message {
  id: number;
  userFrom: Author;
  userTo: Author;
  message: string;
  status: number;
}
