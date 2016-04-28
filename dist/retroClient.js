"use strict";
const call_1 = require('./call');
class RetroClient {
    constructor(request) {
        this.request = request;
        this.request = this.request || require('request').defaults({
            json: true
        });
    }
    constructCall(path, options) {
        return new call_1.RetroCall(this.request, path, options);
    }
}
exports.RetroClient = RetroClient;
//# sourceMappingURL=retroClient.js.map