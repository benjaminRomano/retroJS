"use strict";
const retroClient_1 = require('./retroClient');
const defaultParser_1 = require('./parsers/defaultParser');
const retro_1 = require('./retro');
class RetroBuilder {
    constructor() {
        this._baseUrl = '';
    }
    baseUrl(baseUrl) {
        this._baseUrl = baseUrl;
        return this;
    }
    client(client) {
        this._client = client;
        return this;
    }
    parser(parser) {
        this._parser = parser;
        return this;
    }
    build() {
        const client = this._client || new retroClient_1.RetroClient();
        const parser = this._parser || new defaultParser_1.DefaultParser();
        return new retro_1.Retro(this._baseUrl, client, parser);
    }
}
exports.RetroBuilder = RetroBuilder;
//# sourceMappingURL=retroBuilder.js.map