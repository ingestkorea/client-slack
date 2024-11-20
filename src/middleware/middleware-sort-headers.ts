import { HttpRequest } from "@ingestkorea/util-http-handler";
import { SlackClientResolvedConfig } from "../SlackClient";
import { BuildMiddleware } from "../models";

export const middlewareSortHeaders: BuildMiddleware = async (
  request: HttpRequest,
  config: SlackClientResolvedConfig
) => {
  let { headers } = request;
  let init: Record<string, string> = {};
  const resolvedHeaders = Object.keys(headers)
    .sort()
    .reduce((acc, curr) => {
      acc[curr] = headers[curr];
      return acc;
    }, init);
  request.headers = resolvedHeaders;
  return request;
};
