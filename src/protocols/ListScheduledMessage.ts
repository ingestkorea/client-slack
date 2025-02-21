import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  RequestSerializer,
  ResponseDeserializer,
  ListScheduledMessageResult,
  ScheduledMessage,
  NextCursor,
} from "../models";
import { SlackClientResolvedConfig } from "../SlackClient";
import { parseBody, parseErrorBody, deserializeMetadata, convertSecondsToUtcString } from "./constants";
import { ListScheduledMessageCommandInput, ListScheduledMessageCommandOutput } from "../commands";

export const se_ListScheduledMessageCommand: RequestSerializer<
  ListScheduledMessageCommandInput,
  SlackClientResolvedConfig
> = async (input, config) => {
  const hostname = "slack.com";
  const path = "/api/chat.scheduledMessages.list";
  const headers = {
    host: hostname,
    "content-type": "application/json; charset=utf-8",
  };
  const body = JSON.stringify({
    ...input,
    oldest: Math.round(new Date(input.oldest as string).getTime() / 1000).toString(),
    latest: Math.round(new Date(input.latest as string).getTime() / 1000).toString(),
    limit: input.limit && input.limit < 100 ? input.limit : 20,
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

export const de_ListScheduledMessageCommand: ResponseDeserializer<
  ListScheduledMessageCommandOutput,
  SlackClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode > 300) await parseErrorBody(response);

  let data = await parseBody(response);

  let contents: any = {};
  contents = de_ListScheduledMessageResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...contents,
  };
};

const de_ListScheduledMessageResult = (output: any): ListScheduledMessageResult => {
  if (!output.ok) {
    return {
      ok: output.ok != null ? output.ok : undefined,
      ...(output.error && { error: output.error }),
      ...(output.errors && { errors: output.errors.filter((e: any) => e != null) }),
    };
  }
  return {
    ok: output.ok != null ? output.ok : undefined,
    scheduled_messages: output.scheduled_messages ? de_ScheduledMessageList(output.scheduled_messages) : undefined,
    response_metadata: output.response_metadata ? de_NextCursor(output.response_metadata) : undefined,
  };
};

const de_ScheduledMessageList = (output: any[]): ScheduledMessage[] => {
  const result = (output || []).filter((e) => e != null).map((entry) => de_ScheduledMessage(entry));
  return result;
};

const de_ScheduledMessage = (output: any): ScheduledMessage => {
  return {
    id: output.id ? output.id : undefined,
    channel_id: output.channel_id ? output.channel_id : undefined,
    post_at: output.post_at ? output.post_at : undefined,
    date_created: output.date_created ? output.date_created : undefined,
    text: output.text ? output.text : undefined,
    post_at_utc: output.post_at ? convertSecondsToUtcString(output.post_at) : undefined,
    date_created_utc: output.date_created ? convertSecondsToUtcString(output.date_created) : undefined,
  };
};

const de_NextCursor = (output: any): NextCursor => {
  return {
    next_cursor: output.next_cursor != null ? output.next_cursor : undefined,
  };
};
