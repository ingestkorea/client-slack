import { SupportBlock, ReceiveMessage } from "./SendMessage";

export interface UpdateMessageRequest {
  channel?: string;
  ts: string;
  text: string;
  blocks?: SupportBlock[];
}

export interface UpdateMessageResult {
  ok?: boolean;
  channel?: string;
  ts?: string;
  text?: string;
  message?: UpdatedMessage;
  error?: string;
  errors?: string[];
}

export type UpdatedMessage = ReceiveMessage & { edited?: EditedInfo };
export type EditedInfo = {
  user?: string;
  ts?: string;
};
