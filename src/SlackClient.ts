import { NodeHttpHandler } from "@ingestkorea/util-http-handler";
import { IngestkoreaError } from "@ingestkorea/util-error-handler";
import { SlackCommand, Middleware, Handler } from "./models/index.js";
import { middlewareAuth, middlewareIngestkoreaMetadata, middlewareSign, middlewareRetry } from "./middleware/index.js";

export type Credentials = {
  token?: string;
  channel?: string;
  secret?: string;
};

export interface SlackClientConfig {
  credentials?: Credentials;
}

export type ResolvedCredentials = {
  token: string;
  channel: string;
  secret?: string;
};

export interface SlackClientResolvedConfig {
  credentials: ResolvedCredentials;
}

export class SlackClient {
  config: SlackClientResolvedConfig;
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
    } catch (e) {
      throw e;
    }
  }
}

const composeMiddleware = (middlewares: Middleware[], finalHandler: Handler): Handler => {
  const handler = middlewares.reduceRight((next, middleware) => {
    return middleware(next);
  }, finalHandler);
  return handler;
};

const resolveCredentials = (config: SlackClientConfig): ResolvedCredentials => {
  const { credentials } = config;

  let error = new IngestkoreaError({
    code: 401,
    type: "Unauthorized",
    message: "Invalid Credentials",
    description: "Credentials undefined",
  });
  if (!credentials) throw error;
  if (!credentials.token) {
    error.error.description = "Please Check API Token. (Bot token strings begin with xoxb-....)";
    throw error;
  }
  if (!credentials.channel) {
    error.error.description = "Please Check ChannelID";
    throw error;
  }

  return {
    token: credentials.token,
    channel: credentials.channel,
    ...(credentials.secret && { secret: credentials.secret }),
  };
};
