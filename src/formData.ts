// Source: https://github.com/axios/axios/issues/2049

export function formDataToBuffer(formData: any) {
  let dataBuffer = Buffer.alloc(0);
  let boundary = formData.getBoundary();
  for (let i = 0, len = formData._streams.length; i < len; i++) {
    if (typeof formData._streams[i] !== "function") {
      dataBuffer = bufferWrite(dataBuffer, formData._streams[i]);

      // The item have 2 more "-" in the boundary. No clue why
      // rfc7578 specifies (4.1): "The boundary is supplied as a "boundary"
      //    parameter to the multipart/form-data type.  As noted in Section 5.1
      //    of [RFC2046], the boundary delimiter MUST NOT appear inside any of
      //    the encapsulated parts, and it is often necessary to enclose the
      //    "boundary" parameter values in quotes in the Content-Type header
      //    field."
      // This means, that we can use the boundary as unique value, indicating that
      // we do NOT need to add a break (\r\n). These are added by data-form package.
      //
      // As seen in this example (https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST#Example)
      // the boundary is preceded by 2x "-". If thus --Boundary exists, do not add the break.
      if (
        typeof formData._streams[i] !== "string" ||
        formData._streams[i].substring(2, boundary.length + 2) !== boundary
      ) {
        dataBuffer = bufferWrite(dataBuffer, "\r\n");
      }
    }
  }

  // Close the request
  dataBuffer = bufferWrite(dataBuffer, "--" + boundary + "--");

  return dataBuffer;
}

// Below function appends the data to the Buffer.
export function bufferWrite(buffer: any, data: any) {
  let addBuffer;
  if (typeof data === "string") {
    addBuffer = Buffer.from(data);
  } else if (typeof data === "object" && Buffer.isBuffer(data)) {
    addBuffer = data;
  }

  return Buffer.concat([buffer, addBuffer]);
}
