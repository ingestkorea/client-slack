import { HttpRequest } from "@ingestkorea/util-http-handler";
import { SlackClientResolvedConfig } from "../SlackClient";
import { BuildMiddleware } from "../models";
import { INGESTKOREA_USER_AGENT } from "./constatns";

export const middlewareIngestkoreaMetadata: BuildMiddleware = async (
  request: HttpRequest,
  config: SlackClientResolvedConfig
) => {
  request.headers[INGESTKOREA_USER_AGENT] = "@ingestkorea/client-slack/0.8.x";
  return request;
};

const convertFormatDate = () => {
  let milliseconds = new Date().getTime();
  let iso8601 = new Date(milliseconds).toISOString().replace(/\.\d{3}Z$/, "Z");

  let longDate = iso8601.replace(/[\-:]/g, "");
  let shortDate = longDate.slice(0, 8);
  return { longDate, shortDate };
};
