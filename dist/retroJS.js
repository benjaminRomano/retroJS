"use strict";
var retroBuilder_1 = require('./retroBuilder');
exports.RetroBuilder = retroBuilder_1.RetroBuilder;
var retroClient_1 = require('./retroClient');
exports.RetroClient = retroClient_1.RetroClient;
const decorators_1 = require('./decorators');
exports.decorators = {
    GET: decorators_1.GET,
    POST: decorators_1.POST,
    DELETE: decorators_1.DELETE,
    PUT: decorators_1.PUT,
    Body: decorators_1.Body,
    Path: decorators_1.Path,
    Query: decorators_1.Query,
    Headers: decorators_1.Headers,
    Header: decorators_1.Header,
    Field: decorators_1.Field
};
//# sourceMappingURL=retroJS.js.map