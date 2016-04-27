import 'reflect-metadata';
import {keys, IRequestMethodDescriptor, IParameterDescriptor} from './decorators';
import {Call} from './call';

export class RetroJSBuilder<T> {
    private _baseUrl: string;

    constructor(private target: T ) {
        this._baseUrl = '';
    }

    baseUrl(baseUrl: string): RetroJSBuilder<T> {
        this._baseUrl = baseUrl;
        return this;
    }

    build(): T {
        const handler: ProxyHandler<T> = {
            get: this.constructCall.bind(this)
        };

        return new Proxy(this.target, handler);
    }

    private constructCall(target: T, propertyKey: string | symbol, receiver: any): any {
        const requestDescriptor: IRequestMethodDescriptor = Reflect.getMetadata(keys.Request, target, propertyKey) || '';
        const pathParams: IParameterDescriptor[] = Reflect.getMetadata(keys.Path, target, propertyKey) || [];

        const {method, path} = requestDescriptor;

        return (...args): any => {

            let requestPath: string = path;

            for (const p of pathParams) {
                requestPath = requestPath.replace(`{${p.parameterName}}`, args[p.parameterIndex]);
            }

            const fullPath = this._baseUrl + requestPath;

            return new Call<any>(fullPath, {
                method: method,
                headers: {
                    'User-Agent': 'request'
                }
            });
        };
    }
}