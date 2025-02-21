import { Middleware } from "../models";

export const middlewareSlackAuth: Middleware<any, any> = (next, context) => async (request) => {
  const { token } = context.credentials;
  request.headers = {
    ...request.headers,
    ["authorization"]: "Bearer" + " " + token,
  };
  return next(request);
};
