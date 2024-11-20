import { HttpRequest } from "@ingestkorea/util-http-handler";
import { SlackClientResolvedConfig } from "../SlackClient";
import { BuildMiddleware } from "../models";

export const middlewareSlackAuth: BuildMiddleware = async (request: HttpRequest, config: SlackClientResolvedConfig) => {
  const { token } = config.credentials;
  request.headers = {
    ...request.headers,
    ["authorization"]: "Bearer" + " " + token,
  };
  return request;
};
