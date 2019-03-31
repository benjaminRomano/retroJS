import { ICall, RetroCall } from "./call";
import { AxiosRequestConfig } from "axios";

export class RetroClient {
  constructor(private defaultConfig?: AxiosRequestConfig) {
    this.defaultConfig = this.defaultConfig;
  }

  constructCall<T>(requestConfig: AxiosRequestConfig): ICall<T> {
    return new RetroCall<T>({
      ...this.defaultConfig,
      ...requestConfig
    });
  }
}
