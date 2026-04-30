import { SlackAPIResult } from "./SlackAPI.js";

export type ListScheduledMessagesRequest = {
  oldest?: string; // UTC string
  latest?: string; // UTC string
  limit?: number;
  channel?: string;
  cursor?: string;
  team_id?: string;
};

export type ListScheduledMessagesResult = SlackAPIResult<{
  scheduled_messages: ScheduledMessage[];
  response_metadata?: NextCursor;
}>;

export type ScheduledMessage = ScheduledMessageDefault & ScheduledMessageCustom;

export type ScheduledMessageDefault = {
  id?: number;
  channel_id?: string;
  date_created?: number;
  post_at?: number;
  text?: string;
};

export type ScheduledMessageCustom = {
  date_created_utc?: string;
  post_at_utc?: string;
};

export type NextCursor = {
  next_cursor?: string;
};
