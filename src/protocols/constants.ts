import { IngestkoreaError, ingestkoreaErrorCodeChecker } from "@ingestkorea/util-error-handler";
import { HttpResponse, collectBodyString, destroyStream } from "@ingestkorea/util-http-handler";

export const parseBody = async (output: HttpResponse): Promise<any> => {
  const { statusCode, headers, body: streamBody } = output;

  let isValid = await verifyJsonHeader(headers["content-type"]);
  let data = await collectBodyString(streamBody);

  if (data == "ok") {
    data = JSON.stringify({ ok: true });
    isValid = true;
  }

  if (!isValid) {
    await destroyStream(streamBody);
    let lastError = new IngestkoreaError({
      code: ingestkoreaErrorCodeChecker(statusCode) ? statusCode : 400,
      type: "Bad Request",
      message: "Invalid Request",
      description: "content-type is not application/json",
    });
    throw lastError;
  }

  if (data.length) return JSON.parse(data);
  return {};
};

export const parseErrorBody = async (output: HttpResponse): Promise<void> => {
  const { statusCode, headers, body: streamBody } = output;

  let isValid = await verifyJsonHeader(headers["content-type"]);
  let data = await collectBodyString(streamBody);

  if (data == "used_url" || data == "expired_url") {
    data = JSON.stringify({ ok: false, error: data });
    isValid = true;
  }

  await destroyStream(streamBody);

  let lastError = new IngestkoreaError({
    code: ingestkoreaErrorCodeChecker(statusCode) ? statusCode : 400,
    type: "Bad Request",
    message: "Invalid Request",
    description: isValid && data.length ? JSON.parse(data) : "response content-type is not application/json",
  });

  throw lastError;
};

const verifyJsonHeader = async (contentType: string): Promise<boolean> => {
  return /application\/json/gi.exec(contentType) ? true : false;
};
