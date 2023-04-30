import Author from './Author';

export default interface Job {
  id?: number;
  title: string;
  description: string;
  type: number;
  status?: number;
  images?: Array<string>;
  author?: Author;
  price: number;
  pictureName?: string;
}
