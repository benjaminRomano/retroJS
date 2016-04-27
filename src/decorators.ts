import 'reflect-metadata';

export const keys = {
    Path: Symbol('Path'),
    Request: Symbol('Request')
};

export type Method = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

export interface IParameterDescriptor {
    parameterIndex: number;
    parameterName: string;
}

export interface IRequestMethodDescriptor {
    method: Method;
    path: string;
}

export function Path(parameterName: string): ParameterDecorator {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number): void => {
        let existingPathParams: IParameterDescriptor[] = Reflect.getOwnMetadata(keys.Path, target, propertyKey) || [];

        existingPathParams.push({
            parameterName: parameterName,
            parameterIndex: parameterIndex
        });

        Reflect.defineMetadata(keys.Path, existingPathParams, target, propertyKey);
    };
}

export function GET<T>(path: string): MethodDecorator {
    return createMethodDecorator<T>('GET', path);
}

// TODO: make this disable constructor
export function RetroJSInterface(target: Function): void { }

function createMethodDecorator<T>(method: Method, path: string): MethodDecorator {
    return (target: Object, propertyKey: string | symbol, symbol: TypedPropertyDescriptor<T>): void => {
        let requestMethodDescriptor: IRequestMethodDescriptor = {
            method: method,
            path: path
        };

        Reflect.defineMetadata(keys.Request, requestMethodDescriptor, target, propertyKey);
    };
}