import { IHttpClient } from './retroClient';
import { Retro } from './retro';
export declare class RetroBuilder {
    private _baseUrl;
    private _client;
    constructor();
    baseUrl(baseUrl: string): RetroBuilder;
    client(client: IHttpClient): RetroBuilder;
    build(): Retro;
}
