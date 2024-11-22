import { NodeHttpHandler } from "@ingestkorea/util-http-handler";
import { IngestkoreaError } from "@ingestkorea/util-error-handler";
import { SlackCommand } from "./models";
import {
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
  requestHandler: NodeHttpHandler;
  constructor(config: SlackClientConfig) {
    this.config = {
      credentials: resolveCredentials(config),
    };
    this.requestHandler = new NodeHttpHandler({ connectionTimeout: 3000, socketTimeout: 3000 });
  }

  async send<T, P>(command: SlackCommand<T, P, SlackClientResolvedConfig>): Promise<P> {
    let request = await command.serialize(command.input, this.config);
    request = await middlewareSlackAuth(request, this.config);
    request = await middlewareIngestkoreaMetadata(request, this.config);
    request = await middlewareSign(request, this.config);
    request = await middlewareSortHeaders(request, this.config);
    let response = await middlewareRetry(request, this.config, this.requestHandler);
    let output = await command.deserialize(response);
    return output;
  }
}

const resolveCredentials = (config: SlackClientConfig): ResolvedCredentials => {
  const { credentials } = config;
  let error = new IngestkoreaError({
    code: 401,
    type: "Unauthorized",
    message: "Invalid Credentials",
    description: "Invalid Credentials",
  });
  if (!credentials) throw error;
  if (!credentials.token || !credentials.channel) {
    error.error.description = "Please Check API Token or ChannelID";
    throw error;
  }
  return {
    ...credentials,
    token: credentials.token,
    channel: credentials.channel,
  };
};
