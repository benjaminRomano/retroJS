import 'reflect-metadata';

export const keys = {
    Path: Symbol('Path'),
    Request: Symbol('Request'),
    Query: Symbol('Query'),
    Body: Symbol('Body'),
    Headers: Symbol('Headers'),
    Header: Symbol('Header'),
    Field: Symbol('Field')
};

export interface IPathDescriptor {
    index: number;
    name: string;
}

export interface IBodyDescriptor {
    index: number;
}

export interface IQueryDescriptor {
    index: number;
    name: string;
}

export interface IFieldDescriptor {
    index: number;
    name: string;
}

export interface IHeaderDescriptor {
    index: number;
    name: string;
}

export interface IRequestMethodDescriptor {
    method: string;
    path: string;
}

export interface IHeadersDescriptor {
    [name: string]: string;
}

export function Path(name: string): ParameterDecorator {
    return (target: Object, propertyKey: string | symbol, index: number): void => {
        const existingPathParams: IPathDescriptor[] = Reflect.getOwnMetadata(keys.Path, target, propertyKey) || [];
        
        if (typeof name !== 'string') {
            throw new Error('Path name must be a string');
        }

        existingPathParams.push({
            name: name,
            index: index
        });

        Reflect.defineMetadata(keys.Path, existingPathParams, target, propertyKey);
    };
}

export function Query(name: string): ParameterDecorator {
    return (target: Object, propertyKey: string | symbol, index: number): void => {
        const existingQueryParams: IQueryDescriptor[] = Reflect.getOwnMetadata(keys.Query, target, propertyKey) || [];
        
        if (typeof name !== 'string') {
            throw new Error('Query name must be a string');
        }

        existingQueryParams.push({
            name: name,
            index: index
        });

        Reflect.defineMetadata(keys.Query, existingQueryParams, target, propertyKey);
    };
}

export function Field(name: string): ParameterDecorator {
    return (target: Object, propertyKey: string | symbol, index: number): void => {
        const existingFields: IFieldDescriptor[] = Reflect.getOwnMetadata(keys.Field, target, propertyKey) || [];
        
        if (typeof name !== 'string') {
            throw new Error('Field name must be a string');
        }

        existingFields.push({
            name: name,
            index: index
        });

        Reflect.defineMetadata(keys.Field, existingFields, target, propertyKey);
    };
}

export function Header(name: string): ParameterDecorator {
    return (target: Object, propertyKey: string | symbol, index: number): void => {
        const existingHeaders: IHeaderDescriptor[] = Reflect.getOwnMetadata(keys.Header, target, propertyKey) || [];

        if (typeof name !== 'string') {
            throw new Error('Header name must be a string');
        }

        existingHeaders.push({
            name: name,
            index: index
        });

        Reflect.defineMetadata(keys.Header, existingHeaders, target, propertyKey);
    };
}

export function Body<T>(target: Object, propertyKey: string | symbol, index: number): void {
    const bodyDescriptor: IBodyDescriptor = {
        index: index
    };

    Reflect.defineMetadata(keys.Body, bodyDescriptor, target, propertyKey);
}

export function GET<T>(path: string): MethodDecorator {
    return createMethodDecorator<T>('GET', path);
}

export function POST<T>(path: string): MethodDecorator {
    return createMethodDecorator<T>('POST', path);
}

export function DELETE<T>(path: string): MethodDecorator {
    return createMethodDecorator<T>('DELETE', path);
}

export function PUT<T>(path: string): MethodDecorator {
    return createMethodDecorator<T>('PUT', path);
}

function createMethodDecorator<T>(method: string, path: string): MethodDecorator {
    if (typeof method !== 'string') {
        throw new Error('Method name must be a string');
    } else if (typeof path !== 'string') {
        throw new Error('Method path must be a string');
    }
    
    return (target: Object, propertyKey: string | symbol, symbol: TypedPropertyDescriptor<T>): void => {
        const requestMethodDescriptor: IRequestMethodDescriptor = {
            method: method,
            path: path
        };
        
        
        if (method === 'GET' && Reflect.getMetadata(keys.Body, target, propertyKey)) {
            throw new Error(`${target.constructor.name}.${propertyKey}: GET Request cannot have body`);
        }

        if (Reflect.getMetadata(keys.Body, target, propertyKey) &&
            Reflect.getMetadata(keys.Field, target, propertyKey)) {
            throw new Error(`${target.constructor.name}.${propertyKey}: cannot have both body and field`);
        }
        
        Reflect.defineMetadata(keys.Request, requestMethodDescriptor, target, propertyKey);
    };
}

export function Headers<T>(headers: { [name: string]: string }): MethodDecorator {
    return (target: Object, propertyKey: string | symbol, symbol: TypedPropertyDescriptor<T>): void => {

        Reflect.defineMetadata(keys.Headers, headers, target, propertyKey);
    };
}