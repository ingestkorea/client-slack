import { HttpRequest } from "@ingestkorea/util-http-handler";
import { RequestSerializer, ResponseDeserializer, DeleteMessageResult } from "../models";
import { SlackClientResolvedConfig } from "../SlackClient";
import { parseBody, parseErrorBody, deserializeMetadata, deserializeSlackErrorInfo } from "./constants";
import { DeleteMessageCommandInput, DeleteMessageCommandOutput } from "../commands";

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
    channel: input.channel ? input.channel : config.credentials.channel,
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

export const de_DeleteMessageCommand: ResponseDeserializer<
  DeleteMessageCommandOutput,
  SlackClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode > 300) await parseErrorBody(response);

  let data = await parseBody(response);

  let contents: any = {};
  contents = de_DeleteMessageResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...contents,
  };
};

const de_DeleteMessageResult = (output: any): DeleteMessageResult => {
  if (!output.ok) return deserializeSlackErrorInfo(output);
  return {
    ok: output.ok != null ? output.ok : undefined,
    channel: output.channel ? output.channel : undefined,
    ts: output.ts ? output.ts : undefined,
  };
};
