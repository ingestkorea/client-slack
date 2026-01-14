import { createHmac } from "node:crypto";
import { Middleware } from "../models/index.js";
import { SLACK_REQUEST_TIMESTAMP, SLACK_SIGNATURE } from "./constants.js";

export const middlewareSign: Middleware = (next) => async (input, context) => {
  const { secret } = context.credentials;

  if (!secret) {
    return next(input, context);
  }

  const { unixTime } = convertFormatDate();
  const timestamp = Math.round(unixTime / 1000).toString();
  const signature = createSlackSignature({ timestamp, body: input.request.body }, secret);

  input.request.headers = {
    ...input.request.headers,
    [SLACK_REQUEST_TIMESTAMP]: timestamp,
    [SLACK_SIGNATURE]: signature,
  };

  return next(input, context);
};

const createSlackSignature = (input: { timestamp: string; body: string }, secret: string) => {
  const { timestamp, body = "" } = input;
  const stringForSign = ["v0", timestamp, body].join(":");
  const hmac = createHmac("sha256", secret).update(stringForSign).digest("hex");
  const signature = ["v0", hmac].join("=");
  return signature;
};

/**
 * @param input milliseconds
 */
const convertFormatDate = (input?: number) => {
  const unixTime = input ? input : new Date().getTime();
  const iso8601 = new Date(unixTime).toISOString().replace(/\.\d{3}Z$/, "Z");

  const longDate = iso8601.replace(/[\-:]/g, "");
  const shortDate = longDate.slice(0, 8);

  return { longDate, shortDate, unixTime };
};
