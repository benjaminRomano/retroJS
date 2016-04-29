import 'reflect-metadata';
export declare const keys: {
    Path: symbol;
    Request: symbol;
    Query: symbol;
    Body: symbol;
    Headers: symbol;
    Header: symbol;
    Field: symbol;
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
export declare function Path(name: string): ParameterDecorator;
export declare function Query(name: string): ParameterDecorator;
export declare function Field(name: string): ParameterDecorator;
export declare function Header(name: string): ParameterDecorator;
export declare function Body<T>(target: Object, propertyKey: string | symbol, index: number): void;
export declare function GET<T>(path: string): MethodDecorator;
export declare function POST<T>(path: string): MethodDecorator;
export declare function DELETE<T>(path: string): MethodDecorator;
export declare function PUT<T>(path: string): MethodDecorator;
export declare function Headers<T>(headers: {
    [name: string]: string;
}): MethodDecorator;
