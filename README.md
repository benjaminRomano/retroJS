# RetroJS

RetroJS is a simple HTTP Client for JavaScript  that heavily uses ES2016 decorators. Inspired by [Retrofit](http://square.github.io/retrofit/)

#### How to use
``` ts

// Define a retroJS interface
@RetroJSInterface
class GithubServiceInterface {
    @GET('users/{user}/repos')
    listRepos(@Path('user') user: string): ICall<IRepo[]> {
        return null;
     }
}

const githubServiceInterface = new GithubServiceInterface();

// Use RetroJSBuilder to setup a RetroJSInterface
const retroJSBuilder = new RetroJSBuilder<GithubServiceInterface>(githubServiceInterface);

const githubService = retroJSBuilder
    .baseUrl('https://api.github.com/')
    .build();
    
let call = githubService.listRepos('benjaminromano');
    
// Asychronosouly execute an http request
call.execute().then(result => {
    console.log(result.response); // IncomingMessage object from node http.request
    result.body
        .map(r => r.name)
        .forEach(n => console.log(n));
});

// Re-use an existing call
call.clone().execute().then(result => {
    result.body
        .map(r => r.name)
        .forEach(n => console.log(n));
});

```
