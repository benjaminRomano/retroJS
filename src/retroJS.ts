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
