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
    Header: decorators_1.Header
};
const defaultParser_1 = require('./parsers/defaultParser');
const JSONParser_1 = require('./parsers/JSONParser');
exports.parsers = {
    DefaultParser: defaultParser_1.DefaultParser,
    JSONParser: JSONParser_1.JSONParser
};
//# sourceMappingURL=retroJS.js.map