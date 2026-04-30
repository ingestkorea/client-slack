import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { SlackClientResolvedConfig } from "../models/SlackClient.js";

export type Middleware = (next: Handler) => Handler;

export type Handler = (
  input: { request: HttpRequest },
  context: SlackClientResolvedConfig
) => Promise<{ response: HttpResponse }>;
