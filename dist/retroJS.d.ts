export { ICall } from './call';
export { RetroBuilder } from './retroBuilder';
export { RetroClient, IHttpClient } from './retroClient';
export declare let decorators: {
    GET: <T>(path: string) => <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
    POST: <T>(path: string) => <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
    DELETE: <T>(path: string) => <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
    PUT: <T>(path: string) => <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
    Body: <T>(target: Object, propertyKey: string | symbol, index: number) => void;
    Path: (name: string) => (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
    Query: (name: string) => (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
};
import { DefaultParser } from './parsers/defaultParser';
import { JSONParser } from './parsers/JSONParser';
export declare let parsers: {
    DefaultParser: typeof DefaultParser;
    JSONParser: typeof JSONParser;
};
