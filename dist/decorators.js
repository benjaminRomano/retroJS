"use strict";
require('reflect-metadata');
exports.keys = {
    Path: Symbol('Path'),
    Request: Symbol('Request'),
    Query: Symbol('Query'),
    Body: Symbol('Body'),
    Headers: Symbol('Headers'),
    Header: Symbol('Header'),
    Field: Symbol('Field')
};
function Path(name) {
    return (target, propertyKey, index) => {
        const existingPathParams = Reflect.getOwnMetadata(exports.keys.Path, target, propertyKey) || [];
        if (typeof name !== 'string') {
            throw new Error('Path name must be a string');
        }
        existingPathParams.push({
            name: name,
            index: index
        });
        Reflect.defineMetadata(exports.keys.Path, existingPathParams, target, propertyKey);
    };
}
exports.Path = Path;
function Query(name) {
    return (target, propertyKey, index) => {
        const existingQueryParams = Reflect.getOwnMetadata(exports.keys.Query, target, propertyKey) || [];
        if (typeof name !== 'string') {
            throw new Error('Query name must be a string');
        }
        existingQueryParams.push({
            name: name,
            index: index
        });
        Reflect.defineMetadata(exports.keys.Query, existingQueryParams, target, propertyKey);
    };
}
exports.Query = Query;
function Field(name) {
    return (target, propertyKey, index) => {
        const existingFields = Reflect.getOwnMetadata(exports.keys.Field, target, propertyKey) || [];
        if (typeof name !== 'string') {
            throw new Error('Field name must be a string');
        }
        existingFields.push({
            name: name,
            index: index
        });
        Reflect.defineMetadata(exports.keys.Field, existingFields, target, propertyKey);
    };
}
exports.Field = Field;
function Header(name) {
    return (target, propertyKey, index) => {
        const existingHeaders = Reflect.getOwnMetadata(exports.keys.Header, target, propertyKey) || [];
        if (typeof name !== 'string') {
            throw new Error('Header name must be a string');
        }
        existingHeaders.push({
            name: name,
            index: index
        });
        Reflect.defineMetadata(exports.keys.Header, existingHeaders, target, propertyKey);
    };
}
exports.Header = Header;
function Body(target, propertyKey, index) {
    const bodyDescriptor = {
        index: index
    };
    Reflect.defineMetadata(exports.keys.Body, bodyDescriptor, target, propertyKey);
}
exports.Body = Body;
function GET(path) {
    return createMethodDecorator('GET', path);
}
exports.GET = GET;
function POST(path) {
    return createMethodDecorator('POST', path);
}
exports.POST = POST;
function DELETE(path) {
    return createMethodDecorator('DELETE', path);
}
exports.DELETE = DELETE;
function PUT(path) {
    return createMethodDecorator('PUT', path);
}
exports.PUT = PUT;
function createMethodDecorator(method, path) {
    if (typeof method !== 'string') {
        throw new Error('Method name must be a string');
    }
    else if (typeof path !== 'string') {
        throw new Error('Method path must be a string');
    }
    return (target, propertyKey, symbol) => {
        const requestMethodDescriptor = {
            method: method,
            path: path
        };
        if (method === 'GET' && Reflect.getMetadata(exports.keys.Body, target, propertyKey)) {
            throw new Error(`${target.constructor.name}.${propertyKey}: GET Request cannot have body`);
        }
        if (Reflect.getMetadata(exports.keys.Body, target, propertyKey) &&
            Reflect.getMetadata(exports.keys.Field, target, propertyKey)) {
            throw new Error(`${target.constructor.name}.${propertyKey}: cannot have both body and field`);
        }
        Reflect.defineMetadata(exports.keys.Request, requestMethodDescriptor, target, propertyKey);
    };
}
function Headers(headers) {
    return (target, propertyKey, symbol) => {
        Reflect.defineMetadata(exports.keys.Headers, headers, target, propertyKey);
    };
}
exports.Headers = Headers;
//# sourceMappingURL=decorators.js.map