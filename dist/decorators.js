"use strict";
require('reflect-metadata');
const metadataError_1 = require('./errors/metadataError');
exports.keys = {
    Path: 'Path',
    Request: 'Request',
    Query: 'Query',
    Body: 'Body',
    Headers: 'Headers',
    Header: 'Header',
    Field: 'Field',
    Part: 'Part'
};
function Path(name) {
    return createNamedParameterDecorator(exports.keys.Path, name);
}
exports.Path = Path;
function Query(name) {
    return createNamedParameterDecorator(exports.keys.Query, name);
}
exports.Query = Query;
function Field(name) {
    return createNamedParameterDecorator(exports.keys.Field, name);
}
exports.Field = Field;
function Part(name) {
    return createNamedParameterDecorator(exports.keys.Part, name);
}
exports.Part = Part;
function Header(name) {
    return createNamedParameterDecorator(exports.keys.Header, name);
}
exports.Header = Header;
function Body(target, propertyKey, index) {
    const metadata = Reflect.getOwnMetadata(exports.keys.Body, target, propertyKey);
    if (typeof metadata !== 'undefined') {
        throw new metadataError_1.MetadataError(target, propertyKey, 'cannot have multiple bodies');
    }
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
function Headers(headers) {
    return (target, propertyKey, symbol) => {
        Reflect.defineMetadata(exports.keys.Headers, headers, target, propertyKey);
    };
}
exports.Headers = Headers;
function createNamedParameterDecorator(key, name) {
    return (target, propertyKey, index) => {
        const existingMetadata = Reflect.getOwnMetadata(key, target, propertyKey) || [];
        if (typeof name !== 'string') {
            throw new metadataError_1.MetadataError(target, propertyKey, `${key} must be a string`);
        }
        existingMetadata.push({
            name: name,
            index: index
        });
        Reflect.defineMetadata(key, existingMetadata, target, propertyKey);
    };
}
function createMethodDecorator(method, path) {
    return (target, propertyKey, symbol) => {
        if (typeof method !== 'string') {
            throw new metadataError_1.MetadataError(target, propertyKey, 'method must be a string');
        }
        else if (typeof path !== 'string') {
            throw new metadataError_1.MetadataError(target, propertyKey, 'method path must be a string');
        }
        const requestMethodDescriptor = {
            method: method,
            path: path
        };
        if (method === 'GET' && Reflect.getMetadata(exports.keys.Body, target, propertyKey)) {
            throw new metadataError_1.MetadataError(target, propertyKey, 'GET Request cannot have body');
        }
        if (atLeastTwo(Reflect.getMetadata(exports.keys.Body, target, propertyKey), Reflect.getMetadata(exports.keys.Field, target, propertyKey), Reflect.getMetadata(exports.keys.Part, target, propertyKey))) {
            throw new metadataError_1.MetadataError(target, propertyKey, 'cannot mix Part, Body and Field together');
        }
        Reflect.defineMetadata(exports.keys.Request, requestMethodDescriptor, target, propertyKey);
    };
}
function atLeastTwo(a, b, c) {
    return a ? (b || c) : (b && c);
}
//# sourceMappingURL=decorators.js.map