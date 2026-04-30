import {
  SlackClientResolvedConfig,
  SlackCommand,
  DeleteMessageRequest,
  DeleteMessageResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models/index.js";
import { se_DeleteMessageCommand, de_DeleteMessageCommand } from "../protocols/index.js";

export type DeleteMessageCommandInput = DeleteMessageRequest;
export type DeleteMessageCommandOutput = MetadataBearer & DeleteMessageResult;

export class DeleteMessageCommand extends SlackCommand<
  DeleteMessageCommandInput,
  DeleteMessageCommandOutput,
  SlackClientResolvedConfig
> {
  input: DeleteMessageCommandInput;
  serializer: RequestSerializer<DeleteMessageCommandInput, SlackClientResolvedConfig>;
  deserializer: ResponseDeserializer<DeleteMessageCommandOutput, SlackClientResolvedConfig>;
  constructor(input: DeleteMessageCommandInput) {
    super(input);
    this.input = {
      ts: input.ts,
      ...(input.channel && { channel: input.channel }),
    };
    this.serializer = se_DeleteMessageCommand;
    this.deserializer = de_DeleteMessageCommand;
  }
}
