export declare class MetadataError extends Error {
    private target;
    private property;
    private msg;
    constructor(target: Object, property: string | symbol, msg: string);
}
