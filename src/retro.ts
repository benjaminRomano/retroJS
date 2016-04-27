import 'reflect-metadata';
import *as request from 'request';
import {keys, IRequestMethodDescriptor, IBodyDescriptor, IPathDescriptor, IQueryDescriptor} from './decorators';
import {IHttpClient} from './retroClient';

export class Retro {
    constructor(private baseUrl: string, private client: IHttpClient) { }

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
                options.body = JSON.stringify(args[bodyDescriptor.index]);
            }

            return this.client.constructCall(requestPath, options);
        };
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