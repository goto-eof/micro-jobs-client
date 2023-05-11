import Author from './Author';
import JobPicture from './JobPicture';

export default interface Job {
  id?: number;
  title: string;
  description: string;
  type: number;
  status?: number;
  // imagesContent?: Array<string>;
  author?: Author;
  price: number;
  // pictureName?: string;
  // pictureNamesList?: Array<string>;
  createdDate?: Date;
  lastModifiedDate?: Date;
  jobPictureList?: Array<JobPicture>;
  picture?: string;
}
