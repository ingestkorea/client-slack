import { NodeHttpHandler } from "@ingestkorea/util-http-handler";
import { IngestkoreaError } from "@ingestkorea/util-error-handler";
import { SlackCommand, Middleware, Handler } from "./models";
import {
  middlewareSerialize,
  middlewareDeserialize,
  middlewareSlackAuth,
  middlewareIngestkoreaMetadata,
  middlewareRetry,
  middlewareSortHeaders,
  middlewareSign,
} from "./middleware";

export type Credentials = {
  token?: string;
  channel?: string;
  secret?: string;
};

export type ResolvedCredentials = {
  token: string;
  channel: string;
  secret?: string;
};

export interface SlackClientConfig {
  credentials?: Credentials;
}

export interface SlackClientResolvedConfig {
  credentials: ResolvedCredentials;
}

export class SlackClient {
  config: SlackClientResolvedConfig;
  private requestHandler: Handler<any, any>;
  constructor(config: SlackClientConfig) {
    this.config = {
      credentials: resolveCredentials(config),
    };
    this.requestHandler = async (request) => {
      const httpHandler = new NodeHttpHandler({ connectionTimeout: 3000, socketTimeout: 3000 });
      return httpHandler.handle(request);
    };
  }
  async send<T, P>(command: SlackCommand<T, P, SlackClientResolvedConfig>): Promise<P> {
    const stack = [
      middlewareSerialize(command.serializer),
      middlewareIngestkoreaMetadata,
      middlewareSign,
      middlewareSlackAuth,
      middlewareSortHeaders,
      middlewareRetry,
      middlewareDeserialize(command.deserializer),
    ];
    const handler = composeMiddleware(stack, this.config, this.requestHandler);
    const response = await handler(command.input);
    return response.output;
  }
}

const composeMiddleware = (
  middlewares: Middleware<any, any>[],
  config: SlackClientResolvedConfig,
  finalHandler: Handler<any, any>
) => {
  const handler = middlewares.reduceRight((next, middleware) => {
    return middleware(next, config);
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
