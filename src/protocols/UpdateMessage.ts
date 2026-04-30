import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  SlackClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  UpdateMessageResult,
  UpdatedMessage,
  EditedInfo,
} from "../models/index.js";
import { UpdateMessageCommandInput, UpdateMessageCommandOutput } from "../commands/index.js";
import { parseBody, parseErrorBody, deserializeMetadata, deserializeSlackErrorInfo, compact } from "./constants.js";
import { de_ReceiveMessage } from "./SendMessage.js";

export const se_UpdateMessageCommand: RequestSerializer<UpdateMessageCommandInput, SlackClientResolvedConfig> = async (
  input,
  config
) => {
  const hostname = "slack.com";
  const path = "/api/chat.update";
  const headers = {
    host: hostname,
    "content-type": "application/json; charset=utf-8",
  };
  const body = JSON.stringify({
    ts: input.ts,
    text: input.text,
    channel: input.channel ? input.channel : config.credentials.channel,
    ...(input.blocks && { blocks: input.blocks }),
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

export const de_UpdateMessageCommand: ResponseDeserializer<
  UpdateMessageCommandOutput,
  SlackClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode > 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_UpdateMessageResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_UpdateMessageResult = (output: any): UpdateMessageResult => {
  if (!output.ok) return deserializeSlackErrorInfo(output);
  return {
    ok: true,
    channel: output.channel ?? "",
    ts: output.ts ?? "",
    text: output.text ? output.text : undefined,
    message: output.message ? de_UpdatedMessage(output.message) : undefined,
  };
};

const de_UpdatedMessage = (output: any): UpdatedMessage => {
  const result = de_ReceiveMessage(output);
  return {
    edited: output.edited ? de_EditedInfo(output.edited) : undefined,
    ...result,
  };
};

const de_EditedInfo = (output: any): EditedInfo => {
  return {
    user: output.user ? output.user : undefined,
    ts: output.ts ? output.ts : undefined,
  };
};
