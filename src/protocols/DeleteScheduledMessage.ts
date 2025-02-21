import { HttpRequest } from "@ingestkorea/util-http-handler";
import { RequestSerializer, ResponseDeserializer, DeleteScheduledMessageResult } from "../models";
import { SlackClientResolvedConfig } from "../SlackClient";
import { parseBody, parseErrorBody, deserializeMetadata } from "./constants";
import { DeleteScheduledMessageCommandInput, DeleteScheduledMessageCommandOutput } from "../commands";

export const se_DeleteScheduledMessageCommand: RequestSerializer<
  DeleteScheduledMessageCommandInput,
  SlackClientResolvedConfig
> = async (input, config) => {
  const hostname = "slack.com";
  const path = "/api/chat.deleteScheduledMessage";
  const headers = {
    host: hostname,
    "content-type": "application/json; charset=utf-8",
  };
  const body = JSON.stringify({
    channel: input.channel ? input.channel : config.credentials.channel,
    scheduled_message_id: input.scheduled_message_id,
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

export const de_DeleteScheduledMessageCommand: ResponseDeserializer<
  DeleteScheduledMessageCommandOutput,
  SlackClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode > 300) await parseErrorBody(response);

  let data = await parseBody(response);

  let contents: any = {};
  contents = de_DeleteScheduledMessageResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...contents,
  };
};

const de_DeleteScheduledMessageResult = (output: any): DeleteScheduledMessageResult => {
  if (!output.ok) {
    let cMsg =
      "invalid_scheduled_message_id error: Scheduled messages that have already been posted to Slack or that will be posted to Slack within 60 seconds of the delete request";
    return {
      ok: output.ok != null ? output.ok : undefined,
      ...(output.error && output.error == "invalid_scheduled_message_id" ? { error: cMsg } : { error: output.error }),
      ...(output.errors && { errors: output.errors.filter((e: any) => e != null) }),
    };
  }
  return {
    ok: output.ok != null ? output.ok : undefined,
  };
};
