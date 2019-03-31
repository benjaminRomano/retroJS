import { createHttpBinClient } from "./httpBinClient";

test("http post request", async () => {
  const httpBinClient = createHttpBinClient();

  const response = await httpBinClient.post("hello");

  expect(response.status).toEqual(200);
  expect(response.data).toMatchObject({
    data: "hello",
    url: "https://httpbin.org/post"
  });
});

test("http delete request", async () => {
  const httpBinClient = createHttpBinClient();

  const response = await httpBinClient.delete({ hello: "world" });

  expect(response.status).toEqual(200);
  expect(response.data).toMatchObject({
    data: JSON.stringify({ hello: "world" }),
    url: "https://httpbin.org/delete"
  });
});

test("http put request", async () => {
  const httpBinClient = createHttpBinClient();

  const response = await httpBinClient.put({ hello: "world" });

  expect(response.status).toEqual(200);
  expect(response.data).toMatchObject({
    data: JSON.stringify({ hello: "world" }),
    url: "https://httpbin.org/put"
  });
});

test("http request headers", async () => {
  const httpBinClient = createHttpBinClient();

  // This header argument shold override the value provided in Header decorator
  const response = await httpBinClient.headers("overrides");

  expect(response.status).toEqual(200);
  expect(response.data.headers).toMatchObject({
    Test: "overrides",
    Works: "works",
    Host: "httpbin.org"
  });
});

test("http request form", async () => {
  const httpBinClient = createHttpBinClient();

  // This header argument shold override the value provided in Header decorator
  const response = await httpBinClient.form("Ben", "hello");

  expect(response.status).toEqual(200);
  expect(response.data).toMatchObject({
    form: {
      name: "Ben",
      value: "hello"
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
});

test("http request multi-part form data", async () => {
  const httpBinClient = createHttpBinClient();

  const response = await httpBinClient.formData("Ben");

  expect(response.data.form["field"]).toEqual("Ben");
});
