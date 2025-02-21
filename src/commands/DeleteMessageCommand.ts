import {
  SlackCommand,
  DeleteMessageRequest,
  DeleteMessageResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models";
import { SlackClientResolvedConfig } from "../SlackClient";
import { se_DeleteMessageCommand, de_DeleteMessageCommand } from "../protocols";

export interface DeleteMessageCommandInput extends DeleteMessageRequest {}
export interface DeleteMessageCommandOutput extends MetadataBearer, DeleteMessageResult {}

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
