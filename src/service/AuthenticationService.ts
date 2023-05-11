import { useNavigate } from 'react-router-dom';
import GenericApiService from './GenericApiService';

export default class AuthenticationService {
  public static async logout(callback: () => void) {
    const tokensData = localStorage.getItem('access_token');
    GenericApiService.postHeaders('api/v1/auth/logout', {
      headers: {
        Authorization: `Bearer ${tokensData}`,
      },
    }).then(() => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      callback();
    });
  }
}
