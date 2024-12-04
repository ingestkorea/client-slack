import { createHmac } from "node:crypto";
import { HttpRequest } from "@ingestkorea/util-http-handler";
import { SlackClientResolvedConfig } from "../SlackClient";
import { BuildMiddleware } from "../models";
import { INGESTKOREA_REQUEST_TIMESTAMP, INGESTKOREA_SIGNATURE } from "./constatns";

export const middlewareSign: BuildMiddleware = async (request: HttpRequest, config: SlackClientResolvedConfig) => {
  const { secret } = config.credentials;
  const timestamp = getTimestamp().toString();

  request.headers[INGESTKOREA_REQUEST_TIMESTAMP] = timestamp;
  if (secret) request.headers[INGESTKOREA_SIGNATURE] = createSignature(request, secret);

  return request;
};

const createSignature = (request: HttpRequest, secret: string): string => {
  const { headers, body = "" } = request;
  const timestamp = headers[INGESTKOREA_REQUEST_TIMESTAMP] || getTimestamp().toString();
  const stringForSign = ["v0", timestamp, body].join(":");
  const hmac = createHmac("sha256", secret).update(stringForSign).digest("hex");
  const signature = ["v0", hmac].join("=");
  return signature;
};

const getTimestamp = (): number => {
  let ms = new Date().getTime();
  return Math.round(ms / 1000);
};
