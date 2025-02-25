import { IngestkoreaError, ingestkoreaErrorCodeChecker } from "@ingestkorea/util-error-handler";
import { HttpResponse, collectBodyString, destroyStream } from "@ingestkorea/util-http-handler";
import { ResponseMetadata, SlackErrorInfo } from "../models";

export const deserializeMetadata = (response: HttpResponse): ResponseMetadata => {
  return {
    httpStatusCode: response.statusCode,
  };
};

export const deserializeSlackErrorInfo = (output: any): SlackErrorInfo => {
  return {
    ok: output.ok != null ? output.ok : undefined,
    ...(output.error && { error: output.error }),
    ...(output.errors && { errors: output.errors.filter((e: any) => e != null) }),
  };
};

export const convertSecondsToUtcString = (input: any): string => {
  if (typeof input == "number") return convertISO8601(input * 1000);
  if (typeof input == "string") return convertISO8601(Number(input) * 1000);
  return input;
};

const convertISO8601 = (input: number) => new Date(input).toISOString().replace(/\.\d{3}Z$/, "Z");

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
      description: "response content-type is not application/json",
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

  if (data == "used_url" || data == "expired_url" || data == "invalid_url") {
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
