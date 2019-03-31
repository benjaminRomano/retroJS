import "reflect-metadata";
import { MetadataError } from "./errors/metadataError";

export const keys = {
  Path: "Path",
  Request: "Request",
  Query: "Query",
  Body: "Body",
  Headers: "Headers",
  Header: "Header",
  Field: "Field",
  Part: "Part"
};

export interface INamedParameterDescriptor {
  index: number;
  name: string;
}

export interface IBodyDescriptor {
  index: number;
}

export interface IRequestMethodDescriptor {
  method: string;
  path: string;
}

export interface IHeadersDescriptor {
  [name: string]: string;
}

export function Path(name: string): ParameterDecorator {
  return createNamedParameterDecorator(keys.Path, name);
}

export function Query(name: string): ParameterDecorator {
  return createNamedParameterDecorator(keys.Query, name);
}

export function Field(name: string): ParameterDecorator {
  return createNamedParameterDecorator(keys.Field, name);
}

export function Part(name: string): ParameterDecorator {
  return createNamedParameterDecorator(keys.Part, name);
}

export function Header(name: string): ParameterDecorator {
  return createNamedParameterDecorator(keys.Header, name);
}

export function Body(
  target: Object,
  propertyKey: string | symbol,
  index: number
): void {
  const metadata = Reflect.getOwnMetadata(keys.Body, target, propertyKey);

  if (typeof metadata !== "undefined") {
    throw new MetadataError(target, propertyKey, "cannot have multiple bodies");
  }

  const bodyDescriptor: IBodyDescriptor = {
    index: index
  };

  Reflect.defineMetadata(keys.Body, bodyDescriptor, target, propertyKey);
}

export function GET(path: string): MethodDecorator {
  return createMethodDecorator("GET", path);
}

export function POST(path: string): MethodDecorator {
  return createMethodDecorator("POST", path);
}

export function DELETE(path: string): MethodDecorator {
  return createMethodDecorator("DELETE", path);
}

export function PUT(path: string): MethodDecorator {
  return createMethodDecorator("PUT", path);
}

export function Headers(headers: { [name: string]: string }): MethodDecorator {
  return (target: Object, propertyKey: string | symbol): void => {
    Reflect.defineMetadata(keys.Headers, headers, target, propertyKey);
  };
}

function createNamedParameterDecorator(
  key: symbol | string,
  name: string
): ParameterDecorator {
  return (
    target: Object,
    propertyKey: string | symbol,
    index: number
  ): void => {
    const existingMetadata: INamedParameterDescriptor[] =
      Reflect.getOwnMetadata(key, target, propertyKey) || [];

    if (typeof name !== "string") {
      throw new MetadataError(
        target,
        propertyKey,
        `${String(key)} must be a string`
      );
    }

    existingMetadata.push({
      name: name,
      index: index
    });

    Reflect.defineMetadata(key, existingMetadata, target, propertyKey);
  };
}

function createMethodDecorator(method: string, path: string): MethodDecorator {
  return (target: Object, propertyKey: string | symbol): void => {
    if (typeof method !== "string") {
      throw new MetadataError(target, propertyKey, "method must be a string");
    } else if (typeof path !== "string") {
      throw new MetadataError(
        target,
        propertyKey,
        "method path must be a string"
      );
    }

    const requestMethodDescriptor: IRequestMethodDescriptor = {
      method: method,
      path: path
    };

    if (
      method === "GET" &&
      Reflect.getMetadata(keys.Body, target, propertyKey)
    ) {
      throw new MetadataError(
        target,
        propertyKey,
        "GET Request cannot have body"
      );
    }

    if (
      atLeastTwo(
        Reflect.getMetadata(keys.Body, target, propertyKey),
        Reflect.getMetadata(keys.Field, target, propertyKey),
        Reflect.getMetadata(keys.Part, target, propertyKey)
      )
    ) {
      throw new MetadataError(
        target,
        propertyKey,
        "cannot mix Part, Body and Field together"
      );
    }

    Reflect.defineMetadata(
      keys.Request,
      requestMethodDescriptor,
      target,
      propertyKey
    );
  };
}

function atLeastTwo(a: boolean, b: boolean, c: boolean) {
  return a ? b || c : b && c;
}
