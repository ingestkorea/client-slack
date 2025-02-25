import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  RequestSerializer,
  ResponseDeserializer,
  ListScheduledMessagesResult,
  ScheduledMessage,
  NextCursor,
} from "../models";
import { SlackClientResolvedConfig } from "../SlackClient";
import {
  parseBody,
  parseErrorBody,
  deserializeMetadata,
  deserializeSlackErrorInfo,
  convertSecondsToUtcString,
} from "./constants";
import { ListScheduledMessagesCommandInput, ListScheduledMessagesCommandOutput } from "../commands";

export const se_ListScheduledMessagesCommand: RequestSerializer<
  ListScheduledMessagesCommandInput,
  SlackClientResolvedConfig
> = async (input, config) => {
  const hostname = "slack.com";
  const path = "/api/chat.scheduledMessages.list";
  const headers = {
    host: hostname,
    "content-type": "application/json; charset=utf-8",
  };
  const body = JSON.stringify({
    oldest: Math.round(new Date(input.oldest as string).getTime() / 1000).toString(),
    latest: Math.round(new Date(input.latest as string).getTime() / 1000).toString(),
    ...(input.limit && { limit: input.limit }),
    ...(input.channel && { channel: input.channel }),
    ...(input.cursor && { cursor: input.cursor }),
    ...(input.team_id && { team_id: input.team_id }),
  });
  return new HttpRequest({
    protocol: "https:",
    method: "POST",
    hostname: hostname,
    path: path,
    headers: headers,
    body: body,
  });
};

export const de_ListScheduledMessagesCommand: ResponseDeserializer<
  ListScheduledMessagesCommandOutput,
  SlackClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode > 300) await parseErrorBody(response);

  let data = await parseBody(response);

  let contents: any = {};
  contents = de_ListScheduledMessagesResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...contents,
  };
};

const de_ListScheduledMessagesResult = (output: any): ListScheduledMessagesResult => {
  if (!output.ok) return deserializeSlackErrorInfo(output);
  return {
    ok: output.ok != null ? output.ok : undefined,
    scheduled_messages: output.scheduled_messages ? de_ScheduledMessageList(output.scheduled_messages) : undefined,
    response_metadata: output.response_metadata ? de_NextCursor(output.response_metadata) : undefined,
  };
};

const de_ScheduledMessageList = (output: any[]): ScheduledMessage[] => {
  const result = (output || [])
    .filter((e) => e != null)
    .map((entry) => de_ScheduledMessage(entry))
    .sort((a, b) => {
      if (!a.post_at || !b.post_at) return 0;
      return a.post_at < b.post_at ? -1 : a.post_at > b.post_at ? 1 : 0;
    });
  return result;
};

const de_ScheduledMessage = (output: any): ScheduledMessage => {
  return {
    id: output.id ? output.id : undefined,
    channel_id: output.channel_id ? output.channel_id : undefined,
    date_created: output.date_created ? output.date_created : undefined,
    post_at: output.post_at ? output.post_at : undefined,
    text: output.text ? output.text : undefined,
    date_created_utc: output.date_created ? convertSecondsToUtcString(output.date_created) : undefined,
    post_at_utc: output.post_at ? convertSecondsToUtcString(output.post_at) : undefined,
  };
};

const de_NextCursor = (output: any): NextCursor => {
  return {
    next_cursor: output.next_cursor != null ? output.next_cursor : undefined,
  };
};
