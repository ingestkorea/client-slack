import { Middleware } from "../models/index.js";

export const middlewareAuth: Middleware = (next) => async (input, context) => {
  const { credentials } = context;

  input.request.headers = {
    ...input.request.headers,
    ["authorization"]: "Bearer" + " " + credentials.token,
  };

  return next(input, context);
};
