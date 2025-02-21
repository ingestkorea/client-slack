import {
  SlackCommand,
  SendMessageRequest,
  SendMessageResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models";
import { SlackClientResolvedConfig } from "../SlackClient";
import { se_SendMessageCommand, de_SendMessageCommand } from "../protocols";

export interface SendMessageCommandInput extends SendMessageRequest {}
export interface SendMessageCommandOutput extends MetadataBearer, SendMessageResult {}

export class SendMessageCommand extends SlackCommand<
  SendMessageCommandInput,
  SendMessageCommandOutput,
  SlackClientResolvedConfig
> {
  input: SendMessageCommandInput;
  serializer: RequestSerializer<SendMessageCommandInput, SlackClientResolvedConfig>;
  deserializer: ResponseDeserializer<SendMessageCommandOutput, SlackClientResolvedConfig>;
  constructor(input: SendMessageCommandInput) {
    super(input);
    let invalidBlocks = !input.blocks || !input.blocks.length;
    this.input = {
      text: input.text,
      ...(input.channel && { channel: input.channel }),
      ...(input.blocks && { blocks: input.blocks }),
      ...(invalidBlocks && { blocks: [{ type: "section", text: { type: "plain_text", text: input.text } }] }),
      ...(input.thread_ts && { thread_ts: input.thread_ts }),
      ...(input.mrkdwn && { mrkdwn: input.mrkdwn }),
      ...(input.response_url && {
        response_url: input.response_url.replace(/\\/gi, ""),
        response_type: input.response_type ? input.response_type : "in_channel",
        replace_original: input.replace_original != null ? input.replace_original : false,
        delete_original: input.delete_original != null ? input.delete_original : false,
      }),
    };
    this.serializer = se_SendMessageCommand;
    this.deserializer = de_SendMessageCommand;
  }
}
