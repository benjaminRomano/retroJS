import * as request from 'request';
import * as http from 'http';

export interface ICall<T> {
    execute(): Promise<ICallResult<T>>;
    clone(): ICall<T>;
}

export interface ICallResult<T> {
    response: http.IncomingMessage;
    body: T;
}    

export class Call<T> implements ICall<T> {

    constructor(private path: string, private options: request.CoreOptions) { }

    execute(): Promise<ICallResult<T>> {

        let callback: request.RequestCallback;

        let promise = new Promise<ICallResult<any>>((resolve, reject) => {

            callback = (err: any, response: http.IncomingMessage, body) => {
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

        request(this.path, this.options, callback);

        return promise;
    }

    clone(): Call<T> {
        return new Call<T>(this.path, this.options);
    }
}