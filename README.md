# RetroJS

RetroJS is a simple HTTP Client Generator for JavaScript using decorators. Inspired by [Retrofit](http://square.github.io/retrofit/)

#### Example

```ts
import * as RetroJS from "retrojs";

import { RetroBuilder, StubResponse, GET, Path, Query } from "RetroJS";

import { AxiosResponse } from "axios";

export class GithubClient {
  @GET("users/{user}/repo?sort=pushed")
  listRepos(
    @Path("user") _user: string,
    @Query("type") _type: string
  ): AxiosResponse<any[]> {
    return StubResponse;
  }
}

export function createGithubService() {
  return new RetroBuilder()
    .baseUrl("https://api.github.com/")
    .build()
    .create(GithubClient);
}

const githubService = createGithubService();

githubService
  .listRepos("benjaminRomano", "owner")
  .then(response => console.log(response));
```

#### Decorators

```ts
/* Method Decorators */
@POST('path')
@GET('path')
@DELETE('path')
@PUT('path')
@Headers({ 'User-Agent': 'request' })

/* Parameter Decorators */
someFunction(@Body body: any);
someFunction(@Query('type') type: string);
someFunction(@Path('user') user: string);
someFunction(@Header('Cache-Control') cacheControl: string); // Note: values in @Header take precedence over @Headers
someFunction(@Field('fieldName') value: string); // application/x-www-form-urlencoded
someFunction(@Part('partName') value: string); // multipart/form-data
```
