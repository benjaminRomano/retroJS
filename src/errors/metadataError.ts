export class MetadataError extends Error {
  constructor(target: object, property: string | symbol, msg: string) {
    super(`${target.constructor.name}.${String(property)}: ${msg}`);
  }
}
