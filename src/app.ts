import * as request from 'request';
import * as RetroJS from './retroJS';

const {RetroBuilder, RetroClient} = RetroJS;
const {GET, POST, DELETE, PUT, Body, Path, Query} = RetroJS.decorators;

class GithubService {
    @GET('users/{user}/repos')
    listRepos( @Path('user') user: string, @Query('type') type: string): RetroJS.ICall<any[]> {
        return null;
    }
}

class HttpBin {
    @POST('/post')
    post( @Body body: any): RetroJS.ICall<any> {
        return null;
    }
    
    @DELETE('/delete')
    delete( @Body body: any): RetroJS.ICall<any> {
        return null;
    }
    
    @PUT('/put')
    put( @Body body: any): RetroJS.ICall<any> {
        return null;
    }
}

const client: RetroJS.IHttpClient = new RetroClient(request.defaults({
    headers: {
        'User-Agent': 'request'
    }
}));

const retroBuilder = new RetroBuilder();

const retro = retroBuilder
    .client(client)
    .baseUrl('https://api.github.com/')
    .build();

const githubService = retro.create(GithubService);

const call = githubService.listRepos('benjaminRomano', 'owner');

call.execute().then(result => {
    console.log(result.body.length);
});

// Httpbin tests - http://httpbin.org/

const retro2 = retroBuilder
    .baseUrl('http://httpbin.org/')
    .build();

let httpBin = retro2.create(HttpBin);

httpBin.post({ hello: 'world' }).execute().then(r => {
    console.log(r.body.url, r.body.json);
});

httpBin.delete({ hello: 'world' }).execute().then(r => {
    console.log(r.body.url, r.body.json);
});

httpBin.put({ hello: 'world' }).execute().then(r => {
    console.log(r.body.url, r.body.json);
});