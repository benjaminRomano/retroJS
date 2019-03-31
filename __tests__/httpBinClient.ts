import {
  POST,
  Body,
  DELETE,
  PUT,
  Headers,
  GET,
  Header,
  Field,
  Part
} from "../src/decorators";

import { RetroBuilder, ICall, StubCall } from "../src";

export class HttpBinClient {
  @POST("/post")
  post(@Body _body: any): ICall<any> {
    return StubCall;
  }

  @DELETE("/delete")
  delete(@Body _body: any): ICall<any> {
    return StubCall;
  }

  @PUT("/put")
  put(@Body _body: any): ICall<any> {
    return StubCall;
  }

  @Headers({
    test: "overwritten",
    works: "works"
  })
  @GET("/headers")
  headers(@Header("test") _header: string): ICall<any> {
    return StubCall;
  }

  @POST("/post")
  form(
    @Field("name") _name: string,
    @Field("value") _value: string
  ): ICall<any> {
    return StubCall;
  }

  @POST("/post")
  formData(
    @Part("name") _name: string,
    @Part("value") _value: string
  ): ICall<any> {
    return StubCall;
  }
}

export function createHttpBinClient() {
  return new RetroBuilder()
    .baseUrl("http://httpbin.org/")
    .build()
    .create(HttpBinClient);
}
