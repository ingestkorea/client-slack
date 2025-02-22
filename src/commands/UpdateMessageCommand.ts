import {
  SlackCommand,
  UpdateMessageRequest,
  UpdateMessageResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models";
import { SlackClientResolvedConfig } from "../SlackClient";
import { se_UpdateMessageCommand, de_UpdateMessageCommand } from "../protocols";

export interface UpdateMessageCommandInput extends UpdateMessageRequest {}
export interface UpdateMessageCommandOutput extends MetadataBearer, UpdateMessageResult {}

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
    let invalidBlocks = !input.blocks || !input.blocks.length;
    this.input = {
      ts: input.ts,
      text: input.text,
      ...(input.channel && { channel: input.channel }),
      ...(input.blocks && { blocks: input.blocks }),
      ...(invalidBlocks && { blocks: [{ type: "section", text: { type: "plain_text", text: input.text } }] }),
    };
    this.serializer = se_UpdateMessageCommand;
    this.deserializer = de_UpdateMessageCommand;
  }
}
