import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { IngestkoreaError } from "@ingestkorea/util-error-handler";
import {
  SendMessageOutput,
  ReceiveMessage,
  BotFrofile,
  Icons,
  SectionBlock,
  DividerBlock,
  HeaderBlock,
  PlainText,
  Markdown,
  MetadataBearer,
  ResponseMetadata,
} from "../models";
import { SlackClientResolvedConfig } from "../SlackClient";
import { parseBody, parseErrorBody } from "./constants";
import { SendMessageCommandInput, SendMessageCommandOutput } from "../commands";

export const serializeIngestkorea_restJson_SendMessageCommand = async (
  input: SendMessageCommandInput,
  config: SlackClientResolvedConfig
): Promise<HttpRequest> => {
  const url = input.response_url ? new URL(input.response_url) : new URL("https://slack.com/api/chat.postMessage");
  const hostname = url.hostname;
  const path = url.pathname;
  const headers = {
    host: hostname,
    "content-type": "application/json; charset=utf-8",
  };
  const body = JSON.stringify({
    channel: input.channel ? input.channel : config.credentials.channel,
    text: input.text,
    ...(input.blocks && { blocks: input.blocks }),
    ...(input.thread_ts && { thread_ts: input.thread_ts }),
    ...(input.mrkdwn && { mrkdwn: input.mrkdwn }),
    ...(input.response_type && { response_type: input.response_type }),
    ...(input.replace_original != null && { replace_original: input.replace_original }),
    ...(input.delete_original != null && { delete_original: input.delete_original }),
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

export const deserializeMetadata = (response: HttpResponse): ResponseMetadata => {
  return {
    httpStatusCode: response.statusCode,
  };
};

export const deserializeIngestkorea_restJson_SendMessageCommand = async (response: {
  response: HttpResponse;
  output: MetadataBearer;
}): Promise<SendMessageCommandOutput> => {
  const { response: httpResponse, output } = response;
  if (httpResponse.statusCode > 300) await parseErrorBody(httpResponse);

  const data: any = await parseBody(httpResponse);
  let contents: any = {};
  contents = deserializeIngestkorea_restJson_SendMessageOutput(data);

  return {
    $metadata: {
      ...deserializeMetadata(httpResponse),
      ...output.$metadata,
    },
    ...contents,
  };
};

export const deserializeIngestkorea_restJson_SendMessageOutput = (output: any): SendMessageOutput => {
  let response = {
    ok: output.ok != null ? output.ok : undefined,
    channel: output.channel ? output.channel : undefined,
    ts: output.ts ? output.ts : undefined,
    message: output.message ? deserializeIngestkorea_restJson_ReceiveMessage(output.message) : undefined,
    error: output.error ? output.error : undefined,
    errors: output.errors ? output.errors : undefined,
  };
  if (!response.ok)
    throw new IngestkoreaError({
      code: 400,
      type: "Bad Request",
      message: "Invalid Request",
      ...(response.error && { description: response.error }),
      ...(response.error && response.errors && { description: `[${response.error}]: ${response.errors.join(", ")}` }),
    });
  return response;
};

export const deserializeIngestkorea_restJson_ReceiveMessage = (output: any): ReceiveMessage => {
  return {
    user: output.user ? output.user : undefined,
    type: output.type ? output.type : undefined,
    ts: output.ts ? output.ts : undefined,
    bot_id: output.bot_id ? output.bot_id : undefined,
    app_id: output.app_id ? output.app_id : undefined,
    text: output.text ? output.text : undefined,
    team: output.team ? output.team : undefined,
    bot_profile: output.bot_profile ? deserializeIngestkorea_restJson_BotFrofile(output.bot_profile) : undefined,
    blocks: output.blocks ? deserializeIngestkorea_restJson_Blocks(output.blocks) : undefined,
  };
};

export const deserializeIngestkorea_restJson_BotFrofile = (output: any): BotFrofile => {
  return {
    id: output.id ? output.id : undefined,
    app_id: output.app_id ? output.app_id : undefined,
    name: output.name ? output.name : undefined,
    icons: output.icons ? deserializeIngestkorea_restJson_Icons(output.icons) : undefined,
    deleted: output.deleted != null ? output.deleted : undefined,
    updated: output.updated ? output.updated : undefined,
    team_id: output.team_id ? output.team_id : undefined,
  };
};

export const deserializeIngestkorea_restJson_Icons = (output: any): Icons => {
  return {
    image_36: output.image_36 ? output.image_36 : undefined,
    image_48: output.image_48 ? output.image_48 : undefined,
    image_72: output.image_72 ? output.image_72 : undefined,
  };
};

export const deserializeIngestkorea_restJson_Blocks = (
  output: any[]
): (Partial<SectionBlock> | Partial<DividerBlock> | Partial<HeaderBlock>)[] => {
  let result = output.map((block) => {
    return {
      type: block.type ? block.type : undefined,
      block_id: block.block_id ? block.block_id : undefined,
      text: block.text ? parseTextorMarkdown(block.text) : undefined,
      fields: block.fields ? block.fields.map(parseTextorMarkdown) : undefined,
    };
  });
  return result;
};

const parseTextorMarkdown = (output: any): PlainText | Markdown => {
  return {
    type: output.type ? output.type : undefined,
    text: output.text ? output.text : undefined,
    emoji: output.emoji != null ? output.emoji : undefined,
    verbatim: output.verbatim != null ? output.verbatim : undefined,
  };
};
