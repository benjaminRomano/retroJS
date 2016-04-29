# RetroJS

RetroJS is a simple HTTP Client for JavaScript  that heavily uses ES2016 decorators. Inspired by [Retrofit](http://square.github.io/retrofit/)

#### Example
``` ts
import * as request from 'request';
import * as RetroJS from 'retrojs';

const {RetroBuilder, RetroClient} = RetroJS;
const {GET, POST, DELETE, PUT, Body, Path, Query} = RetroJS.decorators;

class GithubService {
    @GET('users/{user}/repos?sort=pushed')
    listRepos( @Path('user') user: string, @Query('type') type: string): RetroJS.ICall<any[]> {
        return null;
    }
}

// Optional: Use a custom client
const client: RetroJS.IHttpClient = new RetroClient(request.defaults({
    headers: {
        'User-Agent': 'request'
    }
}));

const retro = new RetroBuilder()
    .client(client)
    .baseUrl('https://api.github.com/')
    .build();

// Use the Retro instance to instantiate the class
const githubService = retro.create(GithubService);

const call = githubService.listRepos('benjaminRomano', 'owner');

call.execute().then(result => {
    console.log(result.body.length);
});
```


#### Decorators

``` ts
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