import { ICall, RequestAPI } from './call';
import * as request from 'request';
export interface IHttpClient {
    constructCall<T>(path: string, options: request.CoreOptions): ICall<T>;
}
export declare class RetroClient implements IHttpClient {
    private request;
    constructor(request?: RequestAPI);
    constructCall<T>(path: string, options: request.CoreOptions): ICall<T>;
}
