import { RetroBuilder, StubResponse, GET, Path, Query } from "../src";
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

test.skip("skip", () => {});
