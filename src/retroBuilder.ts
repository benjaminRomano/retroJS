import {IHttpClient, RetroClient} from './retroClient';
import {IParser} from './parsers/IParser';
import {DefaultParser} from './parsers/defaultParser';
import {Retro} from './retro';

export class RetroBuilder {
    private _baseUrl: string;
    private _client: IHttpClient;
    private _parser: IParser;

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

    parser(parser: IParser): RetroBuilder {
        this._parser = parser;
        return this;
    }

    build(): Retro {
        const client: IHttpClient = this._client || new RetroClient();
        const parser: IParser = this._parser || new DefaultParser();

        return new Retro(this._baseUrl, client, parser);
    }
}