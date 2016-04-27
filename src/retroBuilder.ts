import {IHttpClient, RetroClient} from './retroClient';
import {Retro} from './retro';

export class RetroBuilder {
    private _baseUrl: string;
    private _client: IHttpClient;

    constructor() {
        this._baseUrl = '';
    }

    baseUrl(baseUrl: string): RetroBuilder {
        this._baseUrl = baseUrl;
        return this;
    }

    client(client: IHttpClient): RetroBuilder {
        this._client = client;
        return this;
    }

    build(): Retro {
        const client = this._client || new RetroClient();

        return new Retro(this._baseUrl, client);
    }
}