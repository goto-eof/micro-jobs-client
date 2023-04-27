import { useNavigate } from 'react-router-dom';
import GenericService from './GenericService';

export default class AuthenticationService {
  public static async logout(callback: () => void) {
    const tokensData = localStorage.getItem('access_token');
    GenericService.postHeaders('api/v1/auth/logout', {
      headers: {
        Authorization: `Bearer ${tokensData}`,
      },
    }).then(() => {
      localStorage.clear();

      console.log('logout done');
      callback();
    });
  }
}
