import { SlackAPIResult } from "./SlackAPI.js";
import { SupportBlock, ReceiveMessage } from "./SendMessage.js";

export type UpdateMessageRequest = {
  ts: string;
  text: string;
  channel?: string;
  blocks?: SupportBlock[];
};

export type UpdateMessageResult = SlackAPIResult<{
  ts: string;
  channel: string;
  text?: string;
  message?: UpdatedMessage;
}>;

export type UpdatedMessage = ReceiveMessage & { edited?: EditedInfo };
export type EditedInfo = {
  user?: string;
  ts?: string;
};
