export default interface Result<T> {
  result: T;
  success: boolean;
  refresh_token?: boolean;
}
