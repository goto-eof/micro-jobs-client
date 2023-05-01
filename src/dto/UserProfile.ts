import UserPicture from './UserPicture';

export default interface UserProfile {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  description: string;
  stars: number;
  status: number;
  picture: UserPicture;
  role: string;
}
