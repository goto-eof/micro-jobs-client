export default interface Room {
  id: number;
  title: string;
  description: string;
  status: number;
  jobId: number;
  participants: Array<string>;
  pictureName: string;
}
