import { RetroClient } from "./retroClient";
import { RetroProxy } from "./proxy";

export class RetroBuilder {
  private _baseUrl: string;
  private _client: RetroClient | undefined;

  constructor() {
    this._baseUrl = "";
  }

  baseUrl(baseUrl: string): RetroBuilder {
    this._baseUrl = baseUrl;
    return this;
  }

  client(client: RetroClient): RetroBuilder {
    this._client = client;
    return this;
  }

  build(): RetroProxy {
    const client = this._client || new RetroClient();

    return new RetroProxy(this._baseUrl, client);
  }
}
