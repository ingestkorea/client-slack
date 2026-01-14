import { SlackErrorInfo } from "./SlackErrorInfo.js";

export interface DeleteMessageRequest {
  ts: string;
  channel?: string;
}

export interface DeleteMessageResult extends SlackErrorInfo {
  ok?: boolean;
  channel?: string;
  ts?: string;
}
