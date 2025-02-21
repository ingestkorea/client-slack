export interface DeleteScheduledMessageRequest {
  channel?: string;
  scheduled_message_id: string;
}

export interface DeleteScheduledMessageResult {
  ok?: boolean;
  error?: string;
  errors?: string[];
}
