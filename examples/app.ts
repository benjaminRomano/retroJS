import * as RetroJS from "../src";

const { RetroBuilder, RetroClient } = RetroJS;
const {
  GET,
  POST,
  DELETE,
  PUT,
  Headers,
  Part,
  Header,
  Body,
  Path,
  Query,
  Field
} = RetroJS.decorators;

class GithubService {
  @GET("users/{user}/repo?sort=pushed")
  listRepos(
    @Path("user") _user: string,
    @Query("type") _type: string
  ): RetroJS.ICall<any[]> {
    return RetroJS.StubCall;
  }
}

class HttpBin {
  @POST("/post")
  post(@Body _body: any): RetroJS.ICall<any> {
    return RetroJS.StubCall;
  }

  @DELETE("/delete")
  delete(@Body _body: any): RetroJS.ICall<any> {
    return RetroJS.StubCall;
  }

  @PUT("/put")
  put(@Body _body: any): RetroJS.ICall<any> {
    return RetroJS.StubCall;
  }

  @Headers({
    test: "overwritten",
    works: "works"
  })
  @GET("/headers")
  headers(@Header("test") _header: string): RetroJS.ICall<any> {
    return RetroJS.StubCall;
  }

  @POST("/post")
  form(
    @Field("name") _name: string,
    @Field("value") _value: string
  ): RetroJS.ICall<any> {
    return RetroJS.StubCall;
  }

  @POST("/post")
  formData(
    @Part("name") _name: string,
    @Part("value") _value: string
  ): RetroJS.ICall<any> {
    return RetroJS.StubCall;
  }
}

const client = new RetroClient({
  headers: {
    "User-Agent": "axios"
  }
});

const retroBuilder = new RetroBuilder();

const retro = retroBuilder
  .client(client)
  .baseUrl("https://api.github.com/")
  .build();

const githubService = retro.create(GithubService);

const call = githubService.listRepos("benjaminRomano", "owner");

call.execute().then(result => {
  console.log(result.body.length);
});

// Httpbin tests - http://httpbin.org/

const retro2 = retroBuilder.baseUrl("http://httpbin.org/").build();

let httpBin = retro2.create(HttpBin);

httpBin
  .post("hello")
  .execute()
  .then(r => {
    console.log(r.body.url, r.body.json);
  })
  .catch(e => console.log(e));

httpBin
  .delete({ hello: "world" })
  .execute()
  .then(r => {
    console.log(r.body.url, r.body.json);
  });

httpBin
  .put({ hello: "world" })
  .execute()
  .then(r => {
    console.log(r.body.url, r.body.json);
  });

httpBin
  .headers("test")
  .execute()
  .then(r => {
    console.log("http://httpbin.org/headers", r.body.headers);
  });

httpBin
  .form("name", "some value")
  .execute()
  .then(r => {
    console.log(`${r.body.url} form`, r.body.form);
  });

httpBin
  .formData("formData", "moreFormData")
  .execute()
  .then(r => {
    console.log(`${r.body.url} formData`, r.body.form);
  });
