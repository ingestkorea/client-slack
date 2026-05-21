import {
  SlackClientResolvedConfig,
  SlackCommand,
  SendScheduleMessageRequest,
  SendScheduleMessageResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
  SlackClientError,
} from "../models/index.js";
import { se_SendScheduleMessageCommand, de_SendScheduleMessageCommand } from "../protocols/index.js";

export type SendScheduleMessageCommandInput = SendScheduleMessageRequest;
export type SendScheduleMessageCommandOutput = MetadataBearer & SendScheduleMessageResult;

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
      post_at: resolvePostAt(input.post_at),
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

const resolvePostAt = (post_at: string): string => {
  const utcZRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  const MIN_DIFFER = 30_000;

  if (!utcZRegex.test(post_at)) {
    throw new SlackClientError({
      code: "SDK.GENERAL_ERROR",
      message: "post_at type must be in UTC string format, such as 2025-02-15T12:35:17.456Z",
    });
  }

  const scheduled = new Date(post_at).getTime();
  const curr = new Date().getTime();

  if (scheduled - curr < MIN_DIFFER) {
    throw new SlackClientError({
      code: "SDK.GENERAL_ERROR",
      message: "post_at must differ from the current time by at least 30 seconds.",
    });
  }
  return post_at.replace(/\.\d+Z$/, "Z");
};
