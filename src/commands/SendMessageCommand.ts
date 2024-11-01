import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { IngestkoreaError } from "@ingestkorea/util-error-handler";
import { SlackCommand, SendMessageInput, SendMessageOutput } from "../models";
import { SlackClientResolvedConfig } from "../SlackClient";
import {
  serializeIngestkorea_restJson_SendMessageCommand,
  deserializeIngestkorea_restJson_SendMessageCommand,
} from "../protocols/SendMessage";

export interface SendMessageCommandInput extends SendMessageInput {}
export interface SendMessageCommandOutput extends SendMessageOutput {}

export class SendMessageCommand extends SlackCommand<
  SendMessageCommandInput,
  SendMessageCommandOutput,
  SlackClientResolvedConfig
> {
  input: SendMessageCommandInput;
  constructor(input: SendMessageCommandInput) {
    super(input);
    this.input = {
      ...input,
      text: input.text,
      ...(input.channel && { channel: input.channel }),
      ...(!input.blocks && { blocks: [{ type: "section", text: { type: "plain_text", text: input.text } }] }),
      ...(input.blocks && { blocks: input.blocks }),
      ...(input.thread_ts && { thread_ts: input.thread_ts }),
      ...(input.mrkdwn && { mrkdwn: input.mrkdwn }),
    };
  }
  async serialize(input: SendMessageCommandInput, config: SlackClientResolvedConfig): Promise<HttpRequest> {
    if (!config.credentials.token)
      throw new IngestkoreaError({
        code: 400,
        type: "Bad Request",
        message: "Invalid Params",
        description: "Please Check Slack API Token",
      });
    let request = await serializeIngestkorea_restJson_SendMessageCommand(input, config);
    return request;
  }
  async deserialize(response: HttpResponse): Promise<SendMessageCommandOutput> {
    let output = await deserializeIngestkorea_restJson_SendMessageCommand(response);
    return output;
  }
}