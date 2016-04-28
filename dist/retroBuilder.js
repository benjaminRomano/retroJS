"use strict";
const retroClient_1 = require('./retroClient');
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
    build() {
        const client = this._client || new retroClient_1.RetroClient();
        return new retro_1.Retro(this._baseUrl, client);
    }
}
exports.RetroBuilder = RetroBuilder;
//# sourceMappingURL=retroBuilder.js.map