"use strict";
require('reflect-metadata');
exports.keys = {
    Path: Symbol('Path'),
    Request: Symbol('Request'),
    Query: Symbol('Query'),
    Body: Symbol('Body'),
    Headers: Symbol('Headers'),
    Header: Symbol('Header')
};
function Path(name) {
    return (target, propertyKey, index) => {
        const existingPathParams = Reflect.getOwnMetadata(exports.keys.Path, target, propertyKey) || [];
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
        existingQueryParams.push({
            name: name,
            index: index
        });
        Reflect.defineMetadata(exports.keys.Query, existingQueryParams, target, propertyKey);
    };
}
exports.Query = Query;
function Header(name) {
    return (target, propertyKey, index) => {
        const existingHeaders = Reflect.getOwnMetadata(exports.keys.Header, target, propertyKey) || [];
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
    return (target, propertyKey, symbol) => {
        const requestMethodDescriptor = {
            method: method,
            path: path
        };
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