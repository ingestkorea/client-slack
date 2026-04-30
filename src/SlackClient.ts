import { NodeHttpHandler } from "@ingestkorea/util-http-handler";
import {
  SlackClientConfig,
  SlackClientResolvedConfig,
  SlackCommand,
  Middleware,
  Handler,
  SlackClientError,
} from "./models/index.js";
import { middlewareAuth, middlewareIngestkoreaMetadata, middlewareSign, middlewareRetry } from "./middleware/index.js";

export class SlackClient {
  private config: SlackClientResolvedConfig;
  private httpHandler = new NodeHttpHandler({ connectionTimeout: 3000, socketTimeout: 3000 });
  private requestHandler: Handler = async (input, context) => this.httpHandler.handle(input.request);

  constructor(config: SlackClientConfig) {
    this.config = {
      credentials: resolveCredentials(config),
    };
  }

  async send<T, P>(command: SlackCommand<T, P, SlackClientResolvedConfig>): Promise<P> {
    const { input, serializer, deserializer } = command;

    const middlewares: Middleware[] = [middlewareAuth, middlewareIngestkoreaMetadata, middlewareSign, middlewareRetry];
    const handler = composeMiddleware(middlewares, this.requestHandler);

    try {
      const request = await serializer(input, this.config);
      const { response } = await handler({ request }, this.config);
      const output = await deserializer(response, this.config);
      return output;
    } catch (err) {
      if (err instanceof SlackClientError) throw err;
      throw new SlackClientError({
        type: "UNKNOWN_ERROR",
        message: err instanceof Error ? err.message : "unknown error",
      });
    }
  }
}

const composeMiddleware = (middlewares: Middleware[], finalHandler: Handler): Handler => {
  const handler = middlewares.reduceRight((next, middleware) => {
    return middleware(next);
  }, finalHandler);
  return handler;
};

const resolveCredentials = (config: SlackClientConfig): SlackClientResolvedConfig["credentials"] => {
  const { credentials } = config;

  let error = new SlackClientError({
    type: "AUTH_ERROR",
    message: "Credentials undefined",
  });

  if (!credentials) throw error;
  if (!credentials.token) {
    error.message = "Please Check API Token. (Bot token strings begin with xoxb-....)";
    throw error;
  }
  if (!credentials.channel) {
    error.message = "Please Check ChannelID";
    throw error;
  }

  return {
    token: credentials.token,
    channel: credentials.channel,
    ...(credentials.secret && { secret: credentials.secret }),
  };
};
