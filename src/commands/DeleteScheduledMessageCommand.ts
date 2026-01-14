import {
  SlackCommand,
  DeleteScheduledMessageRequest,
  DeleteScheduledMessageResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models/index.js";
import { SlackClientResolvedConfig } from "../SlackClient.js";
import { se_DeleteScheduledMessageCommand, de_DeleteScheduledMessageCommand } from "../protocols/index.js";

export interface DeleteScheduledMessageCommandInput extends DeleteScheduledMessageRequest {}
export interface DeleteScheduledMessageCommandOutput extends MetadataBearer, DeleteScheduledMessageResult {}

export class DeleteScheduledMessageCommand extends SlackCommand<
  DeleteScheduledMessageCommandInput,
  DeleteScheduledMessageCommandOutput,
  SlackClientResolvedConfig
> {
  input: DeleteScheduledMessageCommandInput;
  serializer: RequestSerializer<DeleteScheduledMessageCommandInput, SlackClientResolvedConfig>;
  deserializer: ResponseDeserializer<DeleteScheduledMessageCommandOutput, SlackClientResolvedConfig>;
  constructor(input: DeleteScheduledMessageCommandInput) {
    super(input);
    this.input = {
      scheduled_message_id: input.scheduled_message_id,
      ...(input.channel && { channel: input.channel }),
    };
    this.serializer = se_DeleteScheduledMessageCommand;
    this.deserializer = de_DeleteScheduledMessageCommand;
  }
}
