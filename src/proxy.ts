import "reflect-metadata";
import { MetadataError } from "./errors/metadataError";
import {
  keys,
  IHeadersDescriptor,
  INamedParameterDescriptor,
  IRequestMethodDescriptor,
  IBodyDescriptor,
} from "./decorators";
import { RetroClient } from "./retroClient";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import qs from "query-string";
import FormData from "form-data";

export class RetroProxy {
  constructor(private baseUrl: string, private client: RetroClient) {}

  create<T extends object>(klass: { new (): T }): T {
    const handler: ProxyHandler<T> = {
      get: this.execute.bind(this),
    };

    const target: T = new klass();

    return new Proxy(target, handler);
  }

  /**
   * Execute method stub replacement
   * Constructs and executes request using decorators and supplied args
   */
  private execute<T extends Object>(
    target: T,
    method: string | symbol
  ): (args: any[]) => Promise<AxiosResponse<any>> {
    // TODO: Investigate memoization since we are re-creating this method every request
    return (...args: any[]) => {
      const config = this.createRequestConfig(target, method, args);
      return this.client.execute(config);
    };
  }

  private parseMethodAndUrl(
    target: Object,
    method: string | symbol,
    args: any[]
  ): AxiosRequestConfig {
    const requestMethodDescriptor: IRequestMethodDescriptor = Reflect.getMetadata(
      keys.Request,
      target,
      method
    );

    if (!requestMethodDescriptor) {
      throw new MetadataError(target, method, "Missing Method decorator");
    }

    const pathParams: INamedParameterDescriptor[] =
      Reflect.getMetadata(keys.Path, target, method) || [];

    const queryParams: INamedParameterDescriptor[] =
      Reflect.getMetadata(keys.Query, target, method) || [];

    let url: string = requestMethodDescriptor.path;

    url = this.addPathParams(url, pathParams, args);
    url = this.addQueryParams(url, queryParams, args);

    return {
      method: requestMethodDescriptor.method,
      url,
    };
  }

  private createRequestConfig(
    target: Object,
    method: string | symbol,
    args: any[]
  ): AxiosRequestConfig {
    const bodyDescriptor: IBodyDescriptor = Reflect.getMetadata(
      keys.Body,
      target,
      method
    );

    const requestConfig: AxiosRequestConfig = {
      baseURL: this.baseUrl,
      headers: {},
      ...this.parseMethodAndUrl(target, method, args),
    };

    const headerDescriptors: INamedParameterDescriptor[] =
      Reflect.getMetadata(keys.Header, target, method) || [];

    const headersDescriptor: IHeadersDescriptor = Reflect.getMetadata(
      keys.Headers,
      target,
      method
    );

    const fieldDescriptors: INamedParameterDescriptor[] =
      Reflect.getMetadata(keys.Field, target, method) || [];

    const partDescriptors: INamedParameterDescriptor[] =
      Reflect.getMetadata(keys.Part, target, method) || [];

    if (bodyDescriptor) {
      if (typeof args[bodyDescriptor.index] === "undefined") {
        throw new MetadataError(target, method, "body is undefined");
      }

      requestConfig.data = args[bodyDescriptor.index];
      requestConfig.headers["Content-Type"] = "application/json";
    }

    // Setup headers
    if (headerDescriptors.length > 0 || headersDescriptor) {
      requestConfig.headers = {
        ...requestConfig.headers,
        ...this.createHeaders(headersDescriptor, headerDescriptors, args),
      };
    }

    // Setup FormUrlEncoded
    if (fieldDescriptors.length > 0) {
      requestConfig.data = this.createFormUrlEncoded(fieldDescriptors, args);
      requestConfig.headers["Content-Type"] =
        "application/x-www-form-urlencoded";
    }

    // Setup Multi-part form data
    if (partDescriptors.length > 0) {
      requestConfig.data = this.createFormData(partDescriptors, args);

      requestConfig.headers = {
        ...requestConfig.headers,
        ...requestConfig.data.getHeaders(),
      };
    }

    return requestConfig;
  }

  private createFormUrlEncoded(
    fieldDescriptors: INamedParameterDescriptor[],
    args: any[]
  ): string {
    const form: { [key: string]: any } = {};

    for (const f of fieldDescriptors) {
      if (typeof args[f.index] !== "undefined") {
        form[f.name] = args[f.index];
      }
    }
    return qs.stringify(form);
  }

  private createFormData(
    partDescriptors: INamedParameterDescriptor[],
    args: any[]
  ): FormData {
    const formData = new FormData();

    // TODO: Need to make adjusments to Part decorator to support file uploads
    for (const p of partDescriptors) {
      if (typeof args[p.index] !== "undefined") {
        formData.append(p.name, args[p.index]);
      }
    }

    return formData;
  }

  private createHeaders(
    headersDescriptor: IHeadersDescriptor,
    headerDescriptors: INamedParameterDescriptor[],
    args: any[]
  ): any {
    const headers: any = {};

    if (headersDescriptor) {
      Object.assign(headers, headersDescriptor);
    }

    for (const h of headerDescriptors) {
      if (typeof args[h.index] !== "undefined") {
        headers[h.name] = args[h.index];
      }
    }

    return headers;
  }

  private addPathParams(
    path: string,
    pathParams: INamedParameterDescriptor[],
    args: any[]
  ): string {
    for (const p of pathParams) {
      if (
        typeof args[p.index] !== "string" &&
        typeof args[p.index] !== "number"
      ) {
        throw new Error(
          `Value of path ${p.name} must be either a number or string`
        );
      }

      path = path.replace(`{${p.name}}`, String(args[p.index]));
    }

    return path;
  }

  // TODO: Replace with querystring
  private addQueryParams(
    path: string,
    queryParams: INamedParameterDescriptor[],
    args: any[]
  ): string {
    if (queryParams.length === 0) {
      return path;
    }

    if (path.indexOf("?") === -1) {
      path += "?";
    } else {
      path += "&";
    }

    for (let i = 0; i < queryParams.length; i++) {
      const q = queryParams[i];

      if (typeof args[q.index] === "undefined" || null) {
        continue;
      }

      path += `${q.name}=${args[q.index]}`;

      if (i !== queryParams.length - 1) {
        path += "&";
      }
    }

    return path;
  }
}
