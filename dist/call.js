"use strict";
class RetroCall {
    constructor(parser, request, path, options) {
        this.parser = parser;
        this.request = request;
        this.path = path;
        this.options = options;
    }
    isExecuted() {
        return this.executed;
    }
    execute() {
        if (this.executed) {
            throw new Error('Cannot re-execute call');
        }
        this.executed = true;
        let callback;
        const promise = new Promise((resolve, reject) => {
            callback = (err, response, body) => {
                if (err) {
                    reject(err);
                    return;
                }
                let parsedBody;
                try {
                    parsedBody = this.parser.parse(body);
                }
                catch (err) {
                    reject(err);
                }
                resolve({
                    response: response,
                    body: parsedBody
                });
            };
        });
        this.request(this.path, this.options, callback);
        return promise;
    }
    clone() {
        return new RetroCall(this.parser, this.request, this.path, this.options);
    }
}
exports.RetroCall = RetroCall;
//# sourceMappingURL=call.js.map