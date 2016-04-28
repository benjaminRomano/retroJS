import { IHttpClient } from './retroClient';
import { IParser } from './parsers/IParser';
import { Retro } from './retro';
export declare class RetroBuilder {
    private _baseUrl;
    private _client;
    private _parser;
    constructor();
    baseUrl(baseUrl: string): RetroBuilder;
    client(client: IHttpClient): RetroBuilder;
    parser(parser: IParser): RetroBuilder;
    build(): Retro;
}
