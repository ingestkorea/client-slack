import { HttpHandlerError, HttpHandlerRetryableErrorCode } from "@ingestkorea/util-http-handler";
import { Middleware, SlackClientError } from "../models/index.js";
import { INGESTKOREA_REQUEST_LOG, INGESTKOREA_RETRY, INGESTKOREA_RETRY_DELAY } from "./constants.js";

const isRetryableCode: HttpHandlerRetryableErrorCode[] = ["SDK.NETWORK_ERROR", "SDK.TIMEOUT"];

export const middlewareRetry: Middleware = (next) => async (input, context) => {
  const MAX_RETRIES = 3;
  const MIN_DELAY_MS = 300;
  const BASE_DELAY_MS = 500;
  const MAX_DELAY_MS = 5_000;

  let attempts = 0;
  let totalRetryDelay = 0;

  input.request.headers = input.request.headers ?? {};

  while (attempts < MAX_RETRIES) {
    attempts++;

    const requestLog = `attempt=${attempts}; max=${MAX_RETRIES}; totalRetryDelay=${totalRetryDelay}`;
    input.request.headers[INGESTKOREA_REQUEST_LOG] = requestLog;

    try {
      const { response } = await next(input, context);

      response.headers[INGESTKOREA_RETRY] = attempts.toString();
      response.headers[INGESTKOREA_RETRY_DELAY] = totalRetryDelay.toString();

      return { response };
    } catch (error) {
      let currentError: SlackClientError;
      if (error instanceof SlackClientError) {
        currentError = error;
      } else {
        currentError = new SlackClientError({
          code: error instanceof HttpHandlerError ? error.code : "SDK.UNKNOWN_ERROR",
          message: error instanceof Error ? error.message : String(error),
        });
      }

      const isRetryable = isRetryableCode.some((code) => code === currentError.code);
      if (!isRetryable) {
        throw currentError;
      }

      if (attempts >= MAX_RETRIES) {
        throw currentError;
      }

      const exp = BASE_DELAY_MS * 2 ** (attempts - 1);
      const capped = Math.min(MAX_DELAY_MS, exp);
      const baseWait = Math.max(MIN_DELAY_MS, Math.floor(capped / 2));
      const jitter = Math.floor(Math.random() * (capped - baseWait));
      const delay = baseWait + jitter;

      totalRetryDelay += delay;

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new SlackClientError({
    code: "SDK.UNKNOWN_ERROR",
    message: "Unexpected retry loop termination",
  });
};
