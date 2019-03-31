import { GET, Path, Query } from "../src/decorators";

import { RetroBuilder, ICall, StubCall } from "../src";

export class GithubClient {
  @GET("users/{user}/repo?sort=pushed")
  listRepos(
    @Path("user") _user: string,
    @Query("type") _type: string
  ): ICall<any[]> {
    return StubCall;
  }
}

export function createGithubService() {
  return new RetroBuilder()
    .baseUrl("https://api.github.com/")
    .build()
    .create(GithubClient);
}
