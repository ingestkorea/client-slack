import { HttpRequest } from "@ingestkorea/util-http-handler";
import { SlackClientResolvedConfig } from "../SlackClient";
import { BuildMiddleware } from "../models";
import { createHmac } from "node:crypto";

export const middlewareSign: BuildMiddleware = async (request: HttpRequest, config: SlackClientResolvedConfig) => {
  const { secret } = config.credentials;
  const timestamp = getTimestamp().toString();

  request.headers["x-ingestkorea-request-timestamp"] = timestamp;

  if (secret) {
    const stringForSign = ["v0", timestamp, request.body || ""].join(":");
    const hmac = createHmac("sha256", secret).update(stringForSign).digest("hex");
    const signature = ["v0", hmac].join("=");
    request.headers["x-ingestkorea-signature"] = signature;
  }
  return request;
};

const getTimestamp = () => {
  let ms = new Date().getTime();
  return Math.round(ms / 1000);
};
