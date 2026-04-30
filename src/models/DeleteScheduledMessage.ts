import { SlackAPIResult } from "./SlackAPI.js";

export type DeleteScheduledMessageRequest = {
  scheduled_message_id: string;
  channel?: string;
};

export type DeleteScheduledMessageResult = SlackAPIResult<{}>;
