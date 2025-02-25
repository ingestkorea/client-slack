import { IngestkoreaError } from "@ingestkorea/util-error-handler";
import {
  SlackCommand,
  SendScheduleMessageRequest,
  SendScheduleMessageResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models";
import { SlackClientResolvedConfig } from "../SlackClient";
import { se_SendScheduleMessageCommand, de_SendScheduleMessageCommand } from "../protocols";

export interface SendScheduleMessageCommandInput extends SendScheduleMessageRequest {}
export interface SendScheduleMessageCommandOutput extends MetadataBearer, SendScheduleMessageResult {}

export class SendScheduleMessageCommand extends SlackCommand<
  SendScheduleMessageCommandInput,
  SendScheduleMessageCommandOutput,
  SlackClientResolvedConfig
> {
  input: SendScheduleMessageCommandInput;
  serializer: RequestSerializer<SendScheduleMessageCommandInput, SlackClientResolvedConfig>;
  deserializer: ResponseDeserializer<SendScheduleMessageCommandOutput, SlackClientResolvedConfig>;
  constructor(input: SendScheduleMessageCommandInput) {
    super(input);
    let invalidBlocks = !input.blocks || !input.blocks.length;
    this.input = {
      post_at: verifyPostAt(input.post_at),
      text: input.text,
      ...(input.channel && { channel: input.channel }),
      ...(input.blocks && { blocks: input.blocks }),
      ...(invalidBlocks && { blocks: [{ type: "section", text: { type: "plain_text", text: input.text } }] }),
      ...(input.thread_ts && { thread_ts: input.thread_ts }),
    };
    this.serializer = se_SendScheduleMessageCommand;
    this.deserializer = de_SendScheduleMessageCommand;
  }
}

const verifyPostAt = (input: string): string => {
  let error = new IngestkoreaError({
    code: 400,
    type: "Bad Request",
    message: "Invalid Request",
    description: "VerifyPostAt Error",
  });

  const isUTC = input.match(/Z/gi); // null
  const isDate = input.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/gi);
  if (!isUTC || !isDate) {
    error.error.description =
      "post_at type must be in UTC string format, such as 2025-02-15T12:35:17Z or 2025-02-15T12:35:17.456Z.";
    throw error;
  }

  input = input.replace(/\.\d{3}Z$/, "Z");
  const scheduled = new Date(input).getTime();
  const curr = new Date().getTime();

  if (scheduled - curr < 30000) {
    error.error.description = "post_at must differ from the current time by at least 30 seconds.";
    throw error;
  }
  return input;
};
