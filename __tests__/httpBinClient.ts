import {
  RetroBuilder,
  StubResponse,
  POST,
  Body,
  DELETE,
  PUT,
  Headers,
  GET,
  Header,
  Field,
  Part
} from "../src";
import { AxiosResponse } from "axios";

export class HttpBinClient {
  @POST("/post")
  post(@Body _body: any): AxiosResponse<any> {
    return StubResponse;
  }

  @DELETE("/delete")
  delete(@Body _body: any): AxiosResponse<any> {
    return StubResponse;
  }

  @PUT("/put")
  put(@Body _body: any): AxiosResponse<any> {
    return StubResponse;
  }

  @Headers({
    test: "original",
    works: "works"
  })
  @GET("/headers")
  headers(@Header("test") _header: string): AxiosResponse<any> {
    return StubResponse;
  }

  @POST("/post")
  form(
    @Field("name") _name: string,
    @Field("value") _value: string
  ): AxiosResponse<any> {
    return StubResponse;
  }

  @POST("/post")
  formData(@Part("field") _field: string): AxiosResponse<any> {
    return StubResponse;
  }
}

export function createHttpBinClient() {
  return new RetroBuilder()
    .baseUrl("http://httpbin.org/")
    .build()
    .create(HttpBinClient);
}
