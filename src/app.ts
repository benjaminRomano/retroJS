import {RetroJSInterface, GET, Path, RetroJSBuilder, ICall} from './retroJS';

// Fake interface for testing purposes
interface IRepo {
    name: string;
    fork: string;
}

@RetroJSInterface
class GithubServiceInterface {
    @GET('users/{user}/repos')
    listRepos(@Path('user') user: string): ICall<IRepo[]> {
        return null;
     }
}

const githubServiceInterface = new GithubServiceInterface();

const retroJSBuilder = new RetroJSBuilder<GithubServiceInterface>(githubServiceInterface);

const githubService = retroJSBuilder
    .baseUrl('https://api.github.com/')
    .build();

let call = githubService.listRepos('benjaminromano');

call.execute().then(result => {
    result.body
        .map(r => r.name)
        .forEach(n => console.log(n));
});

call.clone().execute().then(result => {
    result.body
        .map(r => r.name)
        .forEach(n => console.log(n));
});
