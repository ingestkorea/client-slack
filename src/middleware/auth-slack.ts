import { HttpRequest } from "@ingestkorea/util-http-handler";
import { SlackClientResolvedConfig } from "../SlackClient";

export const middlewareSlackAuth = async (
  request: HttpRequest,
  config: SlackClientResolvedConfig
): Promise<HttpRequest> => {
  const { token } = config.credentials;
  request.headers = {
    ...request.headers,
    ["authorization"]: "Bearer" + " " + token,
  };
  return request;
};
