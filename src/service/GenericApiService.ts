import Result from '../dto/Result';
import customAxios from '../interceptors/LoginInterceptor';

export default class GenericApiService {
  private static baseUrl: string = '/';

  public static async getAll<T>(url: string): Promise<T> {
    return await customAxios
      .get<Array<T>>(this.baseUrl + url, { withCredentials: true })
      .then(async (result: any) => {
        return result.data;
      })
      .catch((err: any) => {
        throw err;
      });
  }

  public static async getById<T>(url: string, id: number): Promise<T> {
    return await customAxios
      .get<Array<T>>(`${this.baseUrl}${url}/${id}`, {
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

  public static async get<T>(url: string): Promise<T> {
    return await customAxios
      .get<Array<T>>(`${this.baseUrl}${url}`, {
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

  public static async create<T>(url: string, data: T): Promise<T> {
    return await customAxios
      .post<T>(`${this.baseUrl}${url}`, data, { withCredentials: true })
      .then(async (result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err: any) => {
        throw err;
      });
  }

  public static async createDifResponse<T, U>(
    url: string,
    data: T
  ): Promise<U> {
    return await customAxios
      .post<T>(`${this.baseUrl}${url}`, data, { withCredentials: true })
      .then(async (result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err: any) => {
        throw err;
      });
  }

  public static async postWithouthBody<T>(url: string): Promise<T> {
    return await customAxios
      .post<T>(`${this.baseUrl}${url}`, '', { withCredentials: true })
      .then(async (result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err: any) => {
        throw err;
      });
  }

  public static async postHeaders<T>(
    url: string,
    headers: any
  ): Promise<Result<T>> {
    return await customAxios
      .post<T>(`${this.baseUrl}${url}`, '', {
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
    url: string,
    id: number,
    data: T
  ): Promise<Result<S>> {
    return await customAxios
      .put<T>(`${this.baseUrl}${url}/${id}`, data, {
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

  public static async put<T>(url: string, id: number, data: T): Promise<T> {
    return await customAxios
      .put<T>(`${this.baseUrl}${url}/${id}`, data, {
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

  public static async delete<T>(url: string, id: number): Promise<T> {
    return await customAxios
      .delete(`${this.baseUrl}${url}/${id}`, { withCredentials: true })
      .then(async (result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err: any) => {
        throw err;
      });
  }

  public static async patch<T>(url: string, id: number): Promise<T> {
    return await customAxios
      .patch(`${this.baseUrl}${url}/${id}`, { withCredentials: true })
      .then(async (result: any) => {
        let data = result.data;
        return data;
      })
      .catch((err: any) => {
        throw err;
      });
  }
}
