import Result from '../dto/Result';
import customAxios from '../interceptors/LoginInterceptor';

export default class GenericApiService {
  private static baseUrl: string = '/';
  // process.env.REACT_APP_URI + ':' + process.env.REACT_APP_PORT + '/';

  public static async getAll<T>(modelName: string): Promise<T> {
    return await customAxios
      .get<Array<T>>(this.baseUrl + modelName, { withCredentials: true })
      .then(async (result: any) => {
        return result.data;
      })
      .catch((err: any) => {
        throw err;
      });
  }

  public static async getById<T>(modelName: string, id: number): Promise<T> {
    return await customAxios
      .get<Array<T>>(`${this.baseUrl}${modelName}/${id}`, {
        //  withCredentials: true,
      })
      .then(async (result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err: any) => {
        throw err;
      });
  }

  public static async get<T>(modelName: string): Promise<T> {
    return await customAxios
      .get<Array<T>>(`${this.baseUrl}${modelName}`, {
        //  withCredentials: true,
      })
      .then(async (result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err: any) => {
        throw err;
      });
  }

  public static async create<T>(modelName: string, data: T): Promise<T> {
    return await customAxios
      .post<T>(`${this.baseUrl}${modelName}`, data, { withCredentials: true })
      .then(async (result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err: any) => {
        throw err;
      });
  }

  public static async createDifResponse<T, U>(
    modelName: string,
    data: T
  ): Promise<U> {
    return await customAxios
      .post<T>(`${this.baseUrl}${modelName}`, data, { withCredentials: true })
      .then(async (result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err: any) => {
        throw err;
      });
  }

  public static async post<T>(modelName: string): Promise<T> {
    return await customAxios
      .post<T>(`${this.baseUrl}${modelName}`, '', { withCredentials: true })
      .then(async (result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err: any) => {
        throw err;
      });
  }

  public static async postHeaders<T>(
    modelName: string,
    headers: any
  ): Promise<Result<T>> {
    return await customAxios
      .post<T>(`${this.baseUrl}${modelName}`, '', {
        ...headers,
        withCredentials: true,
      })
      .then(async (result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err: any) => {
        throw err;
      });
  }

  public static async update<T, S>(
    modelName: string,
    id: number,
    data: T
  ): Promise<Result<S>> {
    return await customAxios
      .put<T>(`${this.baseUrl}${modelName}/${id}`, data, {
        //  withCredentials: true,
      })
      .then(async (result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err: any) => {
        throw err;
      });
  }

  public static async put<T>(
    modelName: string,
    id: number,
    data: T
  ): Promise<T> {
    return await customAxios
      .put<T>(`${this.baseUrl}${modelName}/${id}`, data, {
        //  withCredentials: true,
      })
      .then(async (result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err: any) => {
        throw err;
      });
  }

  public static async delete<T>(modelName: string, id: number): Promise<T> {
    return await customAxios
      .delete(`${this.baseUrl}${modelName}/${id}`, { withCredentials: true })
      .then(async (result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err: any) => {
        throw err;
      });
  }

  public static async patch<T>(modelName: string, id: number): Promise<T> {
    return await customAxios
      .patch(`${this.baseUrl}${modelName}/${id}`, { withCredentials: true })
      .then(async (result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err: any) => {
        throw err;
      });
  }
}
