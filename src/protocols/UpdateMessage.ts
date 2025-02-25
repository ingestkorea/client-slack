import { HttpRequest } from "@ingestkorea/util-http-handler";
import { RequestSerializer, ResponseDeserializer, UpdateMessageResult, UpdatedMessage, EditedInfo } from "../models";
import { SlackClientResolvedConfig } from "../SlackClient";
import { UpdateMessageCommandInput, UpdateMessageCommandOutput } from "../commands";
import { parseBody, parseErrorBody, deserializeMetadata, deserializeSlackErrorInfo } from "./constants";
import { de_ReceiveMessage } from "./SendMessage";

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
    hostname: hostname,
    path: path,
    headers: headers,
    body: body,
  });
};

export const de_UpdateMessageCommand: ResponseDeserializer<
  UpdateMessageCommandOutput,
  SlackClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode > 300) await parseErrorBody(response);

  let data = await parseBody(response);

  let contents: any = {};
  contents = de_UpdateMessageResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...contents,
  };
};

const de_UpdateMessageResult = (output: any): UpdateMessageResult => {
  if (!output.ok) return deserializeSlackErrorInfo(output);
  return {
    ok: output.ok != null ? output.ok : undefined,
    channel: output.channel ? output.channel : undefined,
    ts: output.ts ? output.ts : undefined,
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
