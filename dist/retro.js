"use strict";
require('reflect-metadata');
const decorators_1 = require('./decorators');
class Retro {
    constructor(baseUrl, client) {
        this.baseUrl = baseUrl;
        this.client = client;
    }
    create(klass) {
        const handler = {
            get: this.constructCall.bind(this)
        };
        const target = new klass();
        return new Proxy(target, handler);
    }
    constructCall(target, propertyKey, receiver) {
        const requestDescriptor = Reflect.getMetadata(decorators_1.keys.Request, target, propertyKey) || '';
        const pathParams = Reflect.getMetadata(decorators_1.keys.Path, target, propertyKey) || [];
        const queryParams = Reflect.getMetadata(decorators_1.keys.Query, target, propertyKey) || [];
        const bodyDescriptor = Reflect.getMetadata(decorators_1.keys.Body, target, propertyKey);
        const { method, path } = requestDescriptor;
        return (...args) => {
            let requestPath = path;
            requestPath = this.addPathParams(requestPath, pathParams, args);
            requestPath = this.addQueryParams(requestPath, queryParams, args);
            let options = {
                method: method,
                baseUrl: this.baseUrl
            };
            if (bodyDescriptor) {
                options.body = JSON.stringify(args[bodyDescriptor.index]);
            }
            return this.client.constructCall(requestPath, options);
        };
    }
    addPathParams(path, pathParams, args) {
        for (const p of pathParams) {
            path = path.replace(`{${p.name}}`, args[p.index]);
        }
        return path;
    }
    addQueryParams(path, queryParams, args) {
        if (queryParams.length === 0) {
            return path;
        }
        if (path.indexOf('?') === -1) {
            path += '?';
        }
        else {
            path += '&';
        }
        for (let i = 0; i < queryParams.length; i++) {
            const q = queryParams[i];
            path += `${q.name}=${args[q.index]}`;
            if (i !== queryParams.length - 1) {
                path += '&';
            }
        }
        return path;
    }
}
exports.Retro = Retro;
//# sourceMappingURL=retro.js.map