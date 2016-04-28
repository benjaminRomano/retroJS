import {ICall, RetroCall, RequestAPI} from './call';
import {IParser} from './parsers/IParser';
import * as request from 'request';

export interface IHttpClient {
    constructCall<T>(parser: IParser, path: string, options: request.CoreOptions): ICall<T>;
}

export class RetroClient implements IHttpClient {

    constructor(private request?: RequestAPI) {
        this.request = this.request || require('request').defaults({
            json: true
        });
    }

    constructCall<T>(parser: IParser, path: string, options: request.CoreOptions): ICall<T> {
        return new RetroCall<T>(parser, this.request, path, options);
    }
}