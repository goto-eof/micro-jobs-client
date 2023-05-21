export default interface Rating {
  id?: number;
  userVoterId: number;
  userTargetId: number;
  jobInstanceId?: number;
  comment: string;
  rating: number;
}
