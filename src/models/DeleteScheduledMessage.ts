import { SlackErrorInfo } from "./SlackErrorInfo.js";

export interface DeleteScheduledMessageRequest {
  scheduled_message_id: string;
  channel?: string;
}

export interface DeleteScheduledMessageResult extends SlackErrorInfo {
  ok?: boolean;
}
