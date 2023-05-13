import axios from 'axios';
import GenericApiService from '../service/GenericApiService';

const customAxios = axios.create();
export const customInterceptor = (navigate: any) => {
  customAxios.interceptors.response.use(
    async (response) => {
      return response;
    },
    (error) => {
      if (isNotAuthorized(error)) {
        return refreshToken(error, navigate).then((data: any) => {
          if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            error.config.baseURL = undefined;
            error.config.headers[
              'Authorization'
            ] = `Bearer ${data.access_token}`;
            return axios.request(error.config).then(
              (data) => {
                return Promise.resolve(data);
              },
              (error) => {
                if (isNotAuthorized(error)) {
                  navigate('/authenticate');
                  return Promise.reject(error);
                }
                return Promise.reject(error);
              }
            );
          } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            navigate('/authenticate');
            return Promise.reject(error);
          }
        });
      }
      return Promise.reject(error);

      function isNotAuthorized(error: any) {
        return error.response.status === 401 || error.response.status === 403;
      }
    }
  );
};

const refreshToken = (error: any, navigate: (path: string) => {}) => {
  let tokensData = localStorage.getItem('refresh_token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  if (tokensData) {
    return GenericApiService.postHeaders('api/v1/auth/refreshToken', {
      headers: {
        Authorization: `Bearer ${tokensData}`,
      },
    });
  }
  return Promise.resolve(error);
};

customAxios.interceptors.request.use(
  (config: any) => {
    let tokensData = localStorage.getItem('access_token');
    if (tokensData) {
      config.headers['Authorization'] = `Bearer ${tokensData}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error.message);
  }
);

export default customAxios;
