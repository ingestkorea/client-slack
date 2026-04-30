import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  SlackClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  DeleteScheduledMessageResult,
} from "../models/index.js";
import { DeleteScheduledMessageCommandInput, DeleteScheduledMessageCommandOutput } from "../commands/index.js";
import { parseBody, parseErrorBody, deserializeMetadata, deserializeSlackErrorInfo, compact } from "./constants.js";

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
    scheduled_message_id: input.scheduled_message_id,
    channel: input.channel || config.credentials.channel,
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

export const de_DeleteScheduledMessageCommand: ResponseDeserializer<
  DeleteScheduledMessageCommandOutput,
  SlackClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode > 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_DeleteScheduledMessageResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_DeleteScheduledMessageResult = (output: any): DeleteScheduledMessageResult => {
  if (!output.ok) {
    const message =
      "Scheduled messages that have already been posted to Slack or that will be posted to Slack within 60 seconds of the delete request";
    return deserializeSlackErrorInfo(output, message);
  }
  return {
    ok: true,
  };
};
