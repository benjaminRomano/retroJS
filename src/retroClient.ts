import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Used within hand-written HttpClient to avoid compile errors
 */
export const StubResponse: AxiosResponse<any> = null as any;

export class RetroClient {
  constructor(private defaultConfig?: AxiosRequestConfig) {
    this.defaultConfig = this.defaultConfig;
  }

  public execute<T>(
    requestConfig: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return axios.request<T>({
      ...this.defaultConfig,
      ...requestConfig
    });
  }
}
