import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  SlackClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  DeleteMessageResult,
} from "../models/index.js";
import { DeleteMessageCommandInput, DeleteMessageCommandOutput } from "../commands/index.js";
import { parseBody, parseErrorBody, deserializeMetadata, deserializeSlackErrorInfo, compact } from "./constants.js";

export const se_DeleteMessageCommand: RequestSerializer<DeleteMessageCommandInput, SlackClientResolvedConfig> = async (
  input,
  config
) => {
  const hostname = "slack.com";
  const path = "/api/chat.delete";
  const headers = {
    host: hostname,
    "content-type": "application/json; charset=utf-8",
  };
  const body = JSON.stringify({
    ts: input.ts,
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

export const de_DeleteMessageCommand: ResponseDeserializer<
  DeleteMessageCommandOutput,
  SlackClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode > 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_DeleteMessageResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_DeleteMessageResult = (output: any): DeleteMessageResult => {
  if (!output.ok) return deserializeSlackErrorInfo(output);
  return {
    ok: true,
    channel: output.channel ?? "",
    ts: output.ts ?? "",
  };
};
