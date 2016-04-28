export {ICall} from './call';
export {RetroBuilder} from './retroBuilder';
export {RetroClient, IHttpClient} from './retroClient';

import {GET, POST, DELETE, PUT, Body, Path, Query} from './decorators';

export let decorators = {
    GET: GET,
    POST: POST,
    DELETE: DELETE,
    PUT: PUT,
    Body: Body,
    Path: Path,
    Query: Query,
};

import {DefaultParser} from './parsers/defaultParser';
import {JSONParser} from './parsers/JSONParser';

export let parsers = {
    DefaultParser: DefaultParser,
    JSONParser: JSONParser
};
