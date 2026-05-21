export type Credentials = {
  token?: string;
  channel?: string;
  secret?: string;
};

export type HttpHandlerOptions = {
  connectionTimeout: number;
  socketTimeout: number;
  keepAlive: boolean;
  family: 4;
};

export interface SlackClientConfig {
  credentials?: Credentials;
  httpHandler?: Partial<HttpHandlerOptions>;
}

export type ResolvedCredentials = {
  token: string;
  channel: string;
  secret?: string;
};

export interface SlackClientResolvedConfig {
  credentials: ResolvedCredentials;
  httpHandler: HttpHandlerOptions;
}
