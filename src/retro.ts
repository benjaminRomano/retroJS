import "reflect-metadata";
import { MetadataError } from "./errors/metadataError";
import {
  keys,
  IHeadersDescriptor,
  INamedParameterDescriptor,
  IRequestMethodDescriptor,
  IBodyDescriptor
} from "./decorators";
import { RetroClient } from "./retroClient";
import { AxiosRequestConfig } from "axios";
import FormData from "form-data";
import qs from "querystring";

export class Retro {
  constructor(private baseUrl: string, private client: RetroClient) {}

  create<T extends object>(klass: { new (): T }): T {
    const handler: ProxyHandler<T> = {
      get: this.constructCall.bind(this)
    };

    const target: T = new klass();

    return new Proxy(target, handler);
  }

  private constructCall<T extends Object>(
    target: T,
    propertyKey: string | symbol
  ): any {
    return (...args: any[]): any => {
      const requestDescriptor: IRequestMethodDescriptor = Reflect.getMetadata(
        keys.Request,
        target,
        propertyKey
      );
      const pathParams: INamedParameterDescriptor[] =
        Reflect.getMetadata(keys.Path, target, propertyKey) || [];
      const queryParams: INamedParameterDescriptor[] =
        Reflect.getMetadata(keys.Query, target, propertyKey) || [];

      if (!requestDescriptor) {
        throw new MetadataError(
          target,
          propertyKey,
          "missing method decorator"
        );
      }

      let requestPath: string = requestDescriptor.path;

      requestPath = this.addPathParams(requestPath, pathParams, args);
      requestPath = this.addQueryParams(requestPath, queryParams, args);

      const options = this.createOptions(target, propertyKey, args);

      return this.client.constructCall(options);
    };
  }

  private createOptions(
    target: Object,
    propertyKey: string | symbol,
    args: any[]
  ): AxiosRequestConfig {
    const requestDescriptor: IRequestMethodDescriptor = Reflect.getMetadata(
      keys.Request,
      target,
      propertyKey
    );
    const bodyDescriptor: IBodyDescriptor = Reflect.getMetadata(
      keys.Body,
      target,
      propertyKey
    );
    const headerDescriptors: INamedParameterDescriptor[] =
      Reflect.getMetadata(keys.Header, target, propertyKey) || [];
    const headersDescriptor: IHeadersDescriptor = Reflect.getMetadata(
      keys.Headers,
      target,
      propertyKey
    );
    const fieldDescriptors: INamedParameterDescriptor[] =
      Reflect.getMetadata(keys.Field, target, propertyKey) || [];
    const partDescriptors: INamedParameterDescriptor[] =
      Reflect.getMetadata(keys.Part, target, propertyKey) || [];

    const options: AxiosRequestConfig = {
      method: requestDescriptor.method,
      baseURL: this.baseUrl
    };

    if (bodyDescriptor) {
      if (typeof args[bodyDescriptor.index] === "undefined") {
        throw new MetadataError(target, propertyKey, "body is undefined");
      }

      options.data = args[bodyDescriptor.index];
    }

    options.headers = {};

    // Setup headers
    if (headerDescriptors.length > 0 || headersDescriptor) {
      options.headers = {
        ...options.headers,
        ...this.createHeaders(headersDescriptor, headerDescriptors, args)
      };
    }

    // Setup FormUrlEncoded
    if (fieldDescriptors.length > 0) {
      options.data = this.createFormUrlEncoded(fieldDescriptors, args);
      options.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }

    // Setup Multi-part form data
    if (partDescriptors.length > 0) {
      const formData = this.createFormData(partDescriptors, args);
      options.data = formData;

      options.headers = {
        ...options.headers,
        ...formData.getHeaders()
      };
    }

    return options;
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
