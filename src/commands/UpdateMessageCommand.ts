import {
  SlackClientResolvedConfig,
  SlackCommand,
  UpdateMessageRequest,
  UpdateMessageResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models/index.js";
import { se_UpdateMessageCommand, de_UpdateMessageCommand } from "../protocols/index.js";

export type UpdateMessageCommandInput = UpdateMessageRequest;
export type UpdateMessageCommandOutput = MetadataBearer & UpdateMessageResult;

export class UpdateMessageCommand extends SlackCommand<
  UpdateMessageCommandInput,
  UpdateMessageCommandOutput,
  SlackClientResolvedConfig
> {
  input: UpdateMessageCommandInput;
  serializer: RequestSerializer<UpdateMessageCommandInput, SlackClientResolvedConfig>;
  deserializer: ResponseDeserializer<UpdateMessageCommandOutput, SlackClientResolvedConfig>;
  constructor(input: UpdateMessageCommandInput) {
    super(input);
    const isOnlyText = !input.blocks || !input.blocks.length;
    this.input = {
      ts: input.ts,
      text: input.text,
      ...(input.channel && { channel: input.channel }),
      ...(input.blocks && { blocks: input.blocks }),
      ...(isOnlyText && { blocks: [{ type: "section", text: { type: "plain_text", text: input.text } }] }),
    };
    this.serializer = se_UpdateMessageCommand;
    this.deserializer = de_UpdateMessageCommand;
  }
}
