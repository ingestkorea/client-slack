export interface ListScheduledMessageRequest {
  channel?: string;
  cursor?: string;
  latest?: string; // seconds
  oldest?: string; // seconds
  limit?: number;
  team_id?: string;
}

export interface ListScheduledMessageResult {
  ok?: boolean;
  scheduled_messages?: ScheduledMessage[];
  response_metadata?: NextCursor;
  error?: string;
  errors?: string[];
}

export type ScheduledMessage = ScheduledMessageDefault & ScheduledMessageCustom;

export type ScheduledMessageDefault = {
  id?: number;
  channel_id?: string;
  post_at?: number;
  date_created?: number;
  text?: string;
};

export type ScheduledMessageCustom = {
  post_at_utc?: string;
  date_created_utc?: string;
};

export type NextCursor = {
  next_cursor?: string;
};
