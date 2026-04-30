import { SlackAPIResult } from "./SlackAPI.js";

export type DeleteMessageRequest = {
  ts: string;
  channel?: string;
};

export type DeleteMessageResult = SlackAPIResult<{
  ts: string;
  channel: string;
}>;
