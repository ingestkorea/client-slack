import { SupportBlock, ReceiveMessage } from "./SendMessage.js";
import { SlackAPIResult } from "./SlackAPI.js";

export type SendScheduleMessageRequest = {
  post_at: string; // UTC string
  text: string;
  channel?: string;
  blocks?: SupportBlock[];
  thread_ts?: string;
};

export type SendScheduleMessageResult = SlackAPIResult<{
  channel: string;
  scheduled_message_id: string;
  post_at: number; // UTC seconds
  post_at_utc?: string; // UTC string
  message?: ReceiveMessage;
}>;
