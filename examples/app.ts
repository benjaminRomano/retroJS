import * as request from 'request';
import * as RetroJS from '../dist/retroJS';

const {RetroBuilder, RetroClient} = RetroJS;
const {GET, POST, DELETE, PUT, Headers,
    Part, Header, Body, Path, Query, Field} = RetroJS.decorators;

class GithubService {
    @GET('users/{user}/repos?sort=pushed')
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

    @Headers({
        'test': 'overwritten',
        'works': 'works'
    })
    @GET('/headers')
    headers( @Header('test') header: string): RetroJS.ICall<any> {
        return null;
    }

    @POST('/post')
    form( @Field('name') name: string, @Field('value') value: string): RetroJS.ICall<any> {
        return null;
    }

    @POST('/post')
    formData( @Part('name') name: string, @Part('value') value: string): RetroJS.ICall<any> {
        return null;
    }
}

const client: RetroJS.IHttpClient = new RetroClient(request.defaults({
    headers: {
        'User-Agent': 'request'
    },
    json: true
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

httpBin.post('hello').execute().then(r => {
    console.log(r.body.url, r.body.json);
}).catch(e => console.log(e));

httpBin.delete({ hello: 'world' }).execute().then(r => {
    console.log(r.body.url, r.body.json);
});

httpBin.put({ hello: 'world' }).execute().then(r => {
    console.log(r.body.url, r.body.json);
});

httpBin.headers('test').execute().then(r => {
    console.log('http://httpbin.org/headers', r.body.headers);
});

httpBin.form('name', 'some value').execute().then(r => {
    console.log(`${r.body.url} form`, r.body.form);
});

httpBin.formData('formData', 'moreFormData').execute().then(r => {
    console.log(`${r.body.url} formData`, r.body.form);
});
