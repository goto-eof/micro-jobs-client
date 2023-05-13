import UserConst from '../consts/UserConst';
import Job from '../dto/Job';
import UserProfile from '../dto/UserProfile';

export default class UserService {
  static isPublisher(job: Job): boolean {
    return this.getUsername() === job.author?.username;
  }
  static isAdmin(): boolean {
    return UserService.getRole() === UserConst.ROLE_ADMIN;
  }
  public static getUser(): UserProfile {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  public static isSameUsername(username: string): boolean {
    return this.getUser().username === username;
  }

  public static getUsername(): string {
    return this.getUser().username;
  }

  public static getRole(): string {
    return this.getUser().role;
  }

  public static getUserPicture(): string {
    return this.getUser().picture?.pictureName;
  }
}
