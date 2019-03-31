export * from "./call";
export * from "./retroBuilder";
export * from "./retroClient";

import {
  GET,
  POST,
  DELETE,
  PUT,
  Header,
  Headers,
  Body,
  Path,
  Query,
  Field,
  Part
} from "./decorators";

export let decorators = {
  GET: GET,
  POST: POST,
  DELETE: DELETE,
  PUT: PUT,
  Body: Body,
  Path: Path,
  Query: Query,
  Headers: Headers,
  Header: Header,
  Field: Field,
  Part: Part
};
