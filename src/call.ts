import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

export interface ICall<T> {
  execute(): Promise<ICallResult<T>>;
  clone(): ICall<T>;
}

export interface ICallResult<T> {
  response: AxiosResponse;
  body: T;
}

/**
 * Used within hand-written HttpClient to avoid compile errors
 */
class StubCallImpl implements ICall<any> {
  execute(): Promise<ICallResult<any>> {
    throw new Error("Method not implemented.");
  }

  clone(): ICall<any> {
    throw new Error("Method not implemented.");
  }
}

export const StubCall = new StubCallImpl();

export class RetroCall<T> implements ICall<T> {
  private executed: boolean;

  constructor(private requestConfig: AxiosRequestConfig) {
    this.executed = false;
  }

  isExecuted(): boolean {
    return this.executed;
  }

  async execute(): Promise<ICallResult<T>> {
    if (this.executed) {
      throw new Error("Cannot re-execute call");
    }

    this.executed = true;

    const response = await axios.request<T>(this.requestConfig);
    return { response, body: response.data };
  }

  clone(): RetroCall<T> {
    return new RetroCall<T>(this.requestConfig);
  }
}
