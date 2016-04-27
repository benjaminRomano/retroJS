import * as http from 'http';
import * as request from 'request';

export interface ICall<T> {
    execute(): Promise<ICallResult<T>>;
    clone(): ICall<T>;
}

export interface ICallResult<T> {
    response: http.IncomingMessage;
    body: T;
}

export type RequestAPI = request.RequestAPI<request.Request, request.CoreOptions, request.UriOptions | request.UrlOptions>;

export class RetroCall<T> implements ICall<T> {
    private executed: boolean;

    constructor(private request: RequestAPI, private path: string, private options: request.CoreOptions) { }

    isExecuted(): boolean {
        return this.executed;
    }

    execute(): Promise<ICallResult<T>> {

        if (this.executed) {
            throw new Error('Cannot re-execute call');
        }

        this.executed = true;

        let callback: request.RequestCallback;

        let promise = new Promise<ICallResult<any>>((resolve, reject) => {

            callback = (err, response, body) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve({
                    response: response,
                    body: JSON.parse(body)
                });
            };
        });

        this.request(this.path, this.options, callback);

        return promise;
    }

    clone(): RetroCall<T> {
        return new RetroCall<T>(this.request, this.path, this.options);
    }
}