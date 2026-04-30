import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  SlackClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  SendScheduleMessageResult,
} from "../models/index.js";
import { SendScheduleMessageCommandInput, SendScheduleMessageCommandOutput } from "../commands/index.js";
import {
  parseBody,
  parseErrorBody,
  deserializeMetadata,
  deserializeSlackErrorInfo,
  convertSecondsToUtcString,
  compact,
} from "./constants.js";
import { de_ReceiveMessage } from "./SendMessage.js";

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
    post_at: Math.round(new Date(input.post_at).getTime() / 1000),
    text: input.text,
    channel: input.channel ? input.channel : config.credentials.channel,
    ...(input.blocks && { blocks: input.blocks }),
    ...(input.thread_ts && { thread_ts: input.thread_ts }),
  });
  return new HttpRequest({
    protocol: "https:",
    method: "POST",
    hostname,
    path,
    headers,
    body,
  });
};

export const de_SendScheduleMessageCommand: ResponseDeserializer<
  SendScheduleMessageCommandOutput,
  SlackClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode > 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_SendScheduleMessageResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_SendScheduleMessageResult = (output: any): SendScheduleMessageResult => {
  if (!output.ok) return deserializeSlackErrorInfo(output);
  return {
    ok: true,
    channel: output.channel ?? "",
    scheduled_message_id: output.scheduled_message_id ?? "",
    post_at: output.post_at ?? 0,
    post_at_utc: output.post_at ? convertSecondsToUtcString(output.post_at) : undefined,
    message: output.message ? de_ReceiveMessage(output.message) : undefined,
  };
};
