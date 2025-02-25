import { ReceiveMessage, SupportBlock, SlackErrorInfo } from "./";

export interface SendScheduleMessageRequest {
  post_at: string; // UTC string
  text: string;
  channel?: string;
  blocks?: SupportBlock[];
  thread_ts?: string;
}

export interface SendScheduleMessageResult extends SlackErrorInfo {
  ok?: boolean;
  channel?: string;
  scheduled_message_id?: string;
  post_at?: number; // UTC seconds
  post_at_utc?: string; // UTC string
  message?: ReceiveMessage;
}
