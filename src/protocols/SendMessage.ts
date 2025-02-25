import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  RequestSerializer,
  ResponseDeserializer,
  SendMessageResult,
  ReceiveMessage,
  BotFrofile,
  Icons,
  SupportBlock,
  SupportTextType,
  Confirmation,
  SupportElement,
} from "../models";
import { SlackClientResolvedConfig } from "../SlackClient";
import { parseBody, parseErrorBody, deserializeMetadata, deserializeSlackErrorInfo } from "./constants";
import { SendMessageCommandInput, SendMessageCommandOutput } from "../commands";

export const se_SendMessageCommand: RequestSerializer<SendMessageCommandInput, SlackClientResolvedConfig> = async (
  input,
  config
) => {
  const url = input.response_url ? new URL(input.response_url) : new URL("https://slack.com/api/chat.postMessage");
  const hostname = url.hostname;
  const path = url.pathname;
  const headers = {
    host: hostname,
    "content-type": "application/json; charset=utf-8",
  };
  const body = JSON.stringify({
    text: input.text,
    channel: input.channel ? input.channel : config.credentials.channel,
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

export const de_SendMessageCommand: ResponseDeserializer<SendMessageCommandOutput, SlackClientResolvedConfig> = async (
  response,
  config
) => {
  if (response.statusCode > 300) await parseErrorBody(response);

  let data = await parseBody(response);

  let contents: any = {};
  contents = de_SendMessageResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...contents,
  };
};

export const de_SendMessageResult = (output: any): SendMessageResult => {
  if (!output.ok) return deserializeSlackErrorInfo(output);
  return {
    ok: output.ok != null ? output.ok : undefined,
    channel: output.channel ? output.channel : undefined,
    ts: output.ts ? output.ts : undefined,
    message: output.message ? de_ReceiveMessage(output.message) : undefined,
  };
};

export const de_ReceiveMessage = (output: any): ReceiveMessage => {
  return {
    user: output.user ? output.user : undefined,
    type: output.type ? output.type : undefined,
    ts: output.ts ? output.ts : undefined,
    bot_id: output.bot_id ? output.bot_id : undefined,
    app_id: output.app_id ? output.app_id : undefined,
    text: output.text ? output.text : undefined,
    team: output.team ? output.team : undefined,
    bot_profile: output.bot_profile ? de_BotFrofile(output.bot_profile) : undefined,
    blocks: output.blocks ? de_BlockList(output.blocks) : undefined,
  };
};

const de_BotFrofile = (output: any): BotFrofile => {
  return {
    id: output.id ? output.id : undefined,
    app_id: output.app_id ? output.app_id : undefined,
    name: output.name ? output.name : undefined,
    icons: output.icons ? de_Icons(output.icons) : undefined,
    deleted: output.deleted != null ? output.deleted : undefined,
    updated: output.updated ? output.updated : undefined,
    team_id: output.team_id ? output.team_id : undefined,
  };
};

const de_Icons = (output: any): Icons => {
  return {
    image_36: output.image_36 ? output.image_36 : undefined,
    image_48: output.image_48 ? output.image_48 : undefined,
    image_72: output.image_72 ? output.image_72 : undefined,
  };
};

const de_BlockList = (output: any[]): SupportBlock[] => {
  const result = (output || []).filter((e) => e != null).map((entry) => de_Block(entry));
  return result;
};

const de_Block = (output: any): SupportBlock => {
  return {
    type: output.type ? output.type : undefined,
    block_id: output.block_id ? output.block_id : undefined,
    ...(output.text && { text: parseTextOrMarkdown(output.text) }),
    ...(output.fields && { fields: de_FieldList(output.fields) }),
    ...(output.accessory && { accessory: de_Accessory(output.accessory) }),
  };
};

const de_Accessory = (output: any): SupportElement => {
  return {
    type: output.type ? output.type : undefined,
    text: output.text ? parseTextOrMarkdown(output.text) : undefined,
    value: output.value ? output.value : undefined,
    style: output.style ? output.style : undefined,
    action_id: output.action_id ? output.action_id : undefined,
    url: output.url ? output.url : undefined,
    confirm: output.confirm ? de_Confirmation(output.confirm) : undefined,
  } as any;
};

const de_FieldList = (output: any[]): SupportTextType[] => {
  const result: SupportTextType[] = (output || []).filter((e) => e != null).map((entry) => parseTextOrMarkdown(entry));
  return result;
};

const de_Confirmation = (output: any): Confirmation => {
  return {
    title: output.title ? parseTextOrMarkdown(output.title) : undefined,
    text: output.text ? parseTextOrMarkdown(output.text) : undefined,
    confirm: output.confirm ? parseTextOrMarkdown(output.confirm) : undefined,
    deny: output.title ? parseTextOrMarkdown(output.deny) : undefined,
    style: output.style ? output.style : undefined,
  } as any;
};

const parseTextOrMarkdown = (output: any): SupportTextType => {
  return {
    type: output.type ? output.type : undefined,
    text: output.text ? output.text : undefined,
    ...(output.verbatim && { verbatim: output.verbatim }),
    ...(output.emoji && { emoji: output.emoji }),
  };
};
