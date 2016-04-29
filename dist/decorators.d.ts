import 'reflect-metadata';
export declare const keys: {
    Path: string;
    Request: string;
    Query: string;
    Body: string;
    Headers: string;
    Header: string;
    Field: string;
    Part: string;
};
export interface INamedParameterDescriptor {
    index: number;
    name: string;
}
export interface IBodyDescriptor {
    index: number;
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
export declare function Part(name: string): ParameterDecorator;
export declare function Header(name: string): ParameterDecorator;
export declare function Body<T>(target: Object, propertyKey: string | symbol, index: number): void;
export declare function GET<T>(path: string): MethodDecorator;
export declare function POST<T>(path: string): MethodDecorator;
export declare function DELETE<T>(path: string): MethodDecorator;
export declare function PUT<T>(path: string): MethodDecorator;
export declare function Headers<T>(headers: {
    [name: string]: string;
}): MethodDecorator;
