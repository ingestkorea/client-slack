import { SendMessageRequest, ReceiveMessage } from "./SendMessage";

export interface SendScheduleMessageRequest extends SendMessageRequest {
  post_at: string; // UTC string
}

export interface SendScheduleMessageResult {
  ok?: boolean;
  channel?: string;
  message?: ReceiveMessage;
  scheduled_message_id?: string;
  post_at?: number; // UTC seconds
  post_at_utc?: string; // UTC string
  error?: string;
  errors?: string[];
}
