export interface DeleteMessageRequest {
  channel?: string;
  ts: string;
}

export interface DeleteMessageResult {
  ok?: boolean;
  channel?: string;
  ts?: string;
  error?: string;
  errors?: string[];
}
