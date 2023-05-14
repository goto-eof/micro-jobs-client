import Author from './Author';

export default interface Message {
  id: number;
  username: string;
  message: string;
  createdDate: Date;
  picture: string;
  pictureName: string;
}
