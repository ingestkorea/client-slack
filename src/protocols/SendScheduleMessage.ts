import { HttpRequest } from "@ingestkorea/util-http-handler";
import { RequestSerializer, ResponseDeserializer, SendScheduleMessageResult } from "../models";
import { SlackClientResolvedConfig } from "../SlackClient";
import { parseBody, parseErrorBody, deserializeMetadata, convertSecondsToUtcString } from "./constants";
import { SendScheduleMessageCommandInput, SendScheduleMessageCommandOutput } from "../commands";
import { de_SendMessageResult } from "./SendMessage";

export const se_SendScheduleMessageCommand: RequestSerializer<
  SendScheduleMessageCommandInput,
  SlackClientResolvedConfig
> = async (input, config) => {
  const hostname = "slack.com";
  const path = "/api/chat.scheduleMessage";
  const headers = {
    host: hostname,
    "content-type": "application/json; charset=utf-8",
  };
  const body = JSON.stringify({
    channel: input.channel ? input.channel : config.credentials.channel,
    text: input.text,
    post_at: Math.round(new Date(input.post_at).getTime() / 1000),
    ...(input.blocks && { blocks: input.blocks }),
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

export const de_SendScheduleMessageCommand: ResponseDeserializer<
  SendScheduleMessageCommandOutput,
  SlackClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode > 300) await parseErrorBody(response);

  let data = await parseBody(response);

  let contents: any = {};
  contents = de_SendScheduleMessageResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...contents,
  };
};

const de_SendScheduleMessageResult = (output: any): SendScheduleMessageResult => {
  if (!output.ok) {
    return {
      ok: output.ok != null ? output.ok : undefined,
      ...(output.error && { error: output.error }),
      ...(output.errors && { errors: output.errors.filter((e: any) => e != null) }),
    };
  }

  const result = de_SendMessageResult(output);
  return {
    ...result,
    scheduled_message_id: output.scheduled_message_id ? output.scheduled_message_id : undefined,
    post_at: output.post_at ? output.post_at : undefined,
    post_at_utc: output.post_at ? convertSecondsToUtcString(output.post_at) : undefined,
  };
};
