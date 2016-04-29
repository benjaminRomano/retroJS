"use strict";
class MetadataError extends Error {
    constructor(target, property, msg) {
        super(`${target.constructor.name}.${property}: ${msg}`);
        this.target = target;
        this.property = property;
        this.msg = msg;
    }
}
exports.MetadataError = MetadataError;
//# sourceMappingURL=metadataError.js.map