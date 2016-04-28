import 'reflect-metadata';
import { IHttpClient } from './retroClient';
import { IParser } from './parsers/IParser';
export declare class Retro {
    private baseUrl;
    private client;
    private parser;
    constructor(baseUrl: string, client: IHttpClient, parser: IParser);
    create<T>(klass: {
        new (): T;
    }): T;
    private constructCall<T>(target, propertyKey, receiver);
    private addPathParams(path, pathParams, args);
    private addQueryParams(path, queryParams, args);
}
