
export class MetadataError extends Error {
    constructor(private target: Object, private property: string | symbol, private msg: string) {
        super(`${target.constructor.name}.${property}: ${msg}`);
    }
}