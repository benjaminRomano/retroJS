import 'reflect-metadata';
import { IHttpClient } from './retroClient';
export declare class Retro {
    private baseUrl;
    private client;
    constructor(baseUrl: string, client: IHttpClient);
    create<T>(klass: {
        new (): T;
    }): T;
    private constructCall<T>(target, propertyKey, receiver);
    private addPathParams(path, pathParams, args);
    private addQueryParams(path, queryParams, args);
}
