import { SupportBlock, ReceiveMessage, SlackErrorInfo } from "./";

export interface UpdateMessageRequest {
  ts: string;
  text: string;
  channel?: string;
  blocks?: SupportBlock[];
}

export interface UpdateMessageResult extends SlackErrorInfo {
  ok?: boolean;
  channel?: string;
  ts?: string;
  text?: string;
  message?: UpdatedMessage;
}

export type UpdatedMessage = ReceiveMessage & { edited?: EditedInfo };
export type EditedInfo = {
  user?: string;
  ts?: string;
};
