import * as http from 'http';
import * as request from 'request';
import { IParser } from './parsers/IParser';
export interface ICall<T> {
    execute(): Promise<ICallResult<T>>;
    clone(): ICall<T>;
}
export interface ICallResult<T> {
    response: http.IncomingMessage;
    body: T;
}
export declare type RequestAPI = request.RequestAPI<request.Request, request.CoreOptions, request.UriOptions | request.UrlOptions>;
export declare class RetroCall<T> implements ICall<T> {
    private parser;
    private request;
    private path;
    private options;
    private executed;
    constructor(parser: IParser, request: RequestAPI, path: string, options: request.CoreOptions);
    isExecuted(): boolean;
    execute(): Promise<ICallResult<T>>;
    clone(): RetroCall<T>;
}
