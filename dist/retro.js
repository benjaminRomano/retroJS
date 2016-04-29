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
        const headerDescriptors = Reflect.getMetadata(decorators_1.keys.Header, target, propertyKey) || [];
        const headersDescriptor = Reflect.getMetadata(decorators_1.keys.Headers, target, propertyKey);
        const fieldDescriptors = Reflect.getMetadata(decorators_1.keys.Field, target, propertyKey) || [];
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
                if (typeof args[bodyDescriptor.index] === 'undefined') {
                    throw new Error(`${target.constructor.name}.${propertyKey}: body is undefined`);
                }
                options.body = args[bodyDescriptor.index];
            }
            if (fieldDescriptors.length > 0) {
                options.form = this.createForm(fieldDescriptors, args);
            }
            if (headerDescriptors.length > 0 || headersDescriptor) {
                options.headers = this.createHeaders(headersDescriptor, headerDescriptors, args);
            }
            return this.client.constructCall(requestPath, options);
        };
    }
    createForm(fieldDescriptors, args) {
        const form = {};
        for (const f of fieldDescriptors) {
            if (typeof args[f.index] !== 'undefined') {
                form[f.name] = args[f.index];
            }
        }
        return form;
    }
    createHeaders(headersDescriptor, headerDescriptors, args) {
        const headers = {};
        if (headersDescriptor) {
            Object.assign(headers, headersDescriptor);
        }
        for (const h of headerDescriptors) {
            if (typeof args[h.index] !== 'undefined') {
                headers[h.name] = args[h.index];
            }
        }
        return headers;
    }
    addPathParams(path, pathParams, args) {
        for (const p of pathParams) {
            if (typeof args[p.index] !== 'string' && typeof args[p.index] !== 'number') {
                throw new Error(`Value of path ${p.name} must be either a number or string`);
            }
            path = path.replace(`{${p.name}}`, String(args[p.index]));
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
            if (typeof args[q.index] === 'undefined' || null) {
                continue;
            }
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