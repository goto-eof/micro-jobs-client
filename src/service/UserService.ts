import UserProfile from '../dto/UserProfile';

export default class UserService {
  public static getUser(): UserProfile {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  public static isSameUsername(username: string) {
    return this.getUser().username === username;
  }

  public static getUsername(): string {
    return this.getUser().username;
  }

  public static getUserPicture(): string {
    return this.getUser().picture?.picture;
  }
}
