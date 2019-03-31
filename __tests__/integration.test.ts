import { createHttpBinClient } from "./httpBinClient";

test("http get request", async () => {
  const httpBinClient = createHttpBinClient();

  const result = await httpBinClient.post("hello").execute();

  console.log(result);
});

// Httpbin tests - http://httpbin.org/

// httpBinClient
//   .delete({ hello: "world" })
//   .execute()
//   .then(r => {
//     console.log(r.body.url, r.body.json);
//   });

// httpBinClient
//   .put({ hello: "world" })
//   .execute()
//   .then(r => {
//     console.log(r.body.url, r.body.json);
//   });

// httpBinClient
//   .headers("test")
//   .execute()
//   .then(r => {
//     console.log("http://httpbin.org/headers", r.body.headers);
//   });

// httpBinClient
//   .form("name", "some value")
//   .execute()
//   .then(r => {
//     console.log(`${r.body.url} form`, r.body.form);
//   });

// httpBinClient
//   .formData("formData", "moreFormData")
//   .execute()
//   .then(r => {
//     console.log(`${r.body.url} formData`, r.body.form);
//   });
