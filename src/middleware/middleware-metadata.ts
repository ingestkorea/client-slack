import { Middleware } from "../models";
import { INGESTKOREA_USER_AGENT, INGESTKOREA_DATE } from "./constatns";

export const middlewareIngestkoreaMetadata: Middleware<any, any> = (next, context) => async (request) => {
  const { longDate } = convertFormatDate();
  request.headers = {
    ...request.headers,
    [INGESTKOREA_DATE]: longDate,
    [INGESTKOREA_USER_AGENT]: "@ingestkorea/client-slack/1.0.x",
  };
  return next(request);
};

/**
 * @param input milliseconds
 */
const convertFormatDate = (input?: string | number) => {
  let milliseconds = input ? Number(input) : new Date().getTime();
  let iso8601 = new Date(milliseconds).toISOString().replace(/\.\d{3}Z$/, "Z");

  let longDate = iso8601.replace(/[\-:]/g, "");
  let shortDate = longDate.slice(0, 8);
  return { longDate, shortDate };
};
