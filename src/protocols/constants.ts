import { HttpResponse, collectBodyString } from "@ingestkorea/util-http-handler";
import { ResponseMetadata, SlackAPISuccess, SlackAPIFailure, SlackClientError } from "../models/index.js";
import { INGESTKOREA_RETRY, INGESTKOREA_RETRY_DELAY } from "../middleware/constants.js";

export const deserializeMetadata = (response: HttpResponse): ResponseMetadata => {
  const attempts = response.headers[INGESTKOREA_RETRY] || undefined;
  const totalRetryDelay = response.headers[INGESTKOREA_RETRY_DELAY] || undefined;

  return {
    httpStatusCode: response.statusCode,
    ...(attempts && { attempts: Number(attempts) }),
    ...(totalRetryDelay && { totalRetryDelay: Number(totalRetryDelay) }),
  };
};

export const deserializeSlackErrorInfo = (output: any, message: string = "unknown error"): SlackAPIFailure => {
  return {
    ok: false,
    error: output.error ?? message,
    errors: (output.errors || []).filter((e: any) => e != null),
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

  const isJson = isJsonResponse(headers["content-type"]);

  try {
    const data = await collectBodyString(streamBody);

    if (data == "ok") {
      const result: SlackAPISuccess = { ok: true };
      return result;
    }

    if (!isJson) {
      throw new SlackClientError({
        type: "REQUEST_ERROR",
        message: "response content-type is not application/json",
      });
    }

    return data.length ? JSON.parse(data) : {};
  } catch (e) {
    throw new SlackClientError({
      type: "REQUEST_ERROR",
      message: e instanceof Error ? e.message : "parse response body error",
    });
  }
};

export const parseErrorBody = async (output: HttpResponse): Promise<never> => {
  const { statusCode, headers, body: streamBody } = output;

  try {
    const data = await collectBodyString(streamBody);
    throw new SlackClientError({
      type: "REQUEST_ERROR",
      message: `${statusCode} - ${data.slice(0, 30)}...`,
    });
  } catch (e) {
    throw e;
  }
};

const isJsonResponse = (contentType?: string): boolean => {
  return contentType?.toLowerCase().includes("application/json") ?? false;
};

export const compact = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map((item) => compact(item)) as any;
  }

  if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, value]) => value !== undefined) // undefined 필드 제거
        .map(([key, value]) => [key, compact(value)]) // 내부 값 재귀 처리
    ) as any;
  }

  return obj;
};
