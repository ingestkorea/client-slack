import { HttpRequest } from "@ingestkorea/util-http-handler";
import { SlackClientResolvedConfig } from "../SlackClient";
import { BuildMiddleware } from "../models";

export const middlewareIngestkoreaMetadata: BuildMiddleware = async (
  request: HttpRequest,
  config: SlackClientResolvedConfig
) => {
  const { longDate } = convertFormatDate();

  request.headers = {
    ...request.headers,
    ["user-agent"]: "@ingestkorea/client-slack/0.6.x",
    ["x-ingestkorea-date"]: longDate,
  };
  return request;
};

const convertFormatDate = () => {
  let milliseconds = new Date().getTime();
  let iso8601 = new Date(milliseconds).toISOString().replace(/\.\d{3}Z$/, "Z");

  let longDate = iso8601.replace(/[\-:]/g, "");
  let shortDate = longDate.slice(0, 8);
  return { longDate, shortDate };
};
