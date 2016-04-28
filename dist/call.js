"use strict";
class RetroCall {
    constructor(request, path, options) {
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
        let promise = new Promise((resolve, reject) => {
            callback = (err, response, body) => {
                if (err) {
                    reject(err);
                    return;
                }
                try {
                    body = JSON.parse(body);
                }
                catch (e) {
                }
                resolve({
                    response: response,
                    body: body
                });
            };
        });
        this.request(this.path, this.options, callback);
        return promise;
    }
    clone() {
        return new RetroCall(this.request, this.path, this.options);
    }
}
exports.RetroCall = RetroCall;
//# sourceMappingURL=call.js.map