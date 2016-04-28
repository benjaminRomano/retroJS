import { ICall, RequestAPI } from './call';
import { IParser } from './parsers/IParser';
import * as request from 'request';
export interface IHttpClient {
    constructCall<T>(parser: IParser, path: string, options: request.CoreOptions): ICall<T>;
}
export declare class RetroClient implements IHttpClient {
    private request;
    constructor(request?: RequestAPI);
    constructCall<T>(parser: IParser, path: string, options: request.CoreOptions): ICall<T>;
}
