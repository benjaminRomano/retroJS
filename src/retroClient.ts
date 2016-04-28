import {ICall, RetroCall, RequestAPI} from './call';
import * as request from 'request';

export interface IHttpClient {
    constructCall<T>(path: string, options: request.CoreOptions): ICall<T>;
}

export class RetroClient implements IHttpClient {
    
    constructor(private request?: RequestAPI) {
        this.request = this.request || require('request').defaults({
            json: true
        });
    }

    constructCall<T>(path: string, options: request.CoreOptions): ICall<T> {
        return new RetroCall<T>(this.request, path, options);
    }
}