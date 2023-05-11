export default interface MessageResponse {
  id: number;
  usernameFrom: string;
  usernameTo: string;
  message: string;
  createdDate: Date;
}
