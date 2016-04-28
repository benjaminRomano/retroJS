import 'reflect-metadata';
import * as request from 'request';
import {keys, IHeadersDescriptor, IHeaderDescriptor,
    IRequestMethodDescriptor, IBodyDescriptor,
    IPathDescriptor, IQueryDescriptor} from './decorators';
import {IHttpClient} from './retroClient';
import {IParser} from './parsers/IParser';

export class Retro {
    constructor(private baseUrl: string, private client: IHttpClient, private parser: IParser) { }

    create<T>(klass: { new (): T; }): T {

        const handler: ProxyHandler<T> = {
            get: this.constructCall.bind(this)
        };

        const target: T = new klass();

        return new Proxy(target, handler);
    }

    private constructCall<T>(target: T, propertyKey: string | symbol, receiver: any): any {
        const requestDescriptor: IRequestMethodDescriptor = Reflect.getMetadata(keys.Request, target, propertyKey) || '';
        const pathParams: IPathDescriptor[] = Reflect.getMetadata(keys.Path, target, propertyKey) || [];
        const queryParams: IQueryDescriptor[] = Reflect.getMetadata(keys.Query, target, propertyKey) || [];
        const bodyDescriptor: IBodyDescriptor = Reflect.getMetadata(keys.Body, target, propertyKey);
        const headerDescriptors: IHeaderDescriptor[] = Reflect.getMetadata(keys.Header, target, propertyKey) || [];
        const headersDescriptor: IHeadersDescriptor = Reflect.getMetadata(keys.Headers, target, propertyKey);

        const {method, path} = requestDescriptor;

        return (...args): any => {

            let requestPath: string = path;

            requestPath = this.addPathParams(requestPath, pathParams, args);
            requestPath = this.addQueryParams(requestPath, queryParams, args);

            let options: request.CoreOptions = {
                method: method,
                baseUrl: this.baseUrl
            };

            if (bodyDescriptor) {
                options.body = this.parser.encode(args[bodyDescriptor.index]);
            }

            if (headerDescriptors.length > 0 || headersDescriptor) {
                options.headers = this.createHeaders(headersDescriptor, headerDescriptors, args);
            }

            return this.client.constructCall(this.parser, requestPath, options);
        };
    }

    private createHeaders(headersDescriptor: IHeadersDescriptor, headerDescriptors: IHeaderDescriptor[], args: any[]): request.Headers {

        const headers: request.Headers = {};

        if (headersDescriptor) {
            Object.assign(headers, headersDescriptor);
        }

        for (const h of headerDescriptors) {
            headers[h.name] = args[h.index];
        }

        return headers;
    }

    private addPathParams(path: string, pathParams: IPathDescriptor[], args: any[]): string {
        for (const p of pathParams) {
            path = path.replace(`{${p.name}}`, args[p.index]);
        }

        return path;
    }

    private addQueryParams(path: string, queryParams: IQueryDescriptor[], args: any[]): string {
        if (queryParams.length === 0) {
            return path;
        }

        if (path.indexOf('?') === -1) {
            path += '?';
        } else {
            path += '&';
        }

        for (let i = 0; i < queryParams.length; i++) {
            const q = queryParams[i];

            path += `${q.name}=${args[q.index]}`;

            if (i !== queryParams.length - 1) {
                path += '&';
            }
        }

        return path;
    }
}