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
