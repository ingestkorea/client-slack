import { IngestkoreaError } from "@ingestkorea/util-error-handler";
import {
  SlackCommand,
  ListScheduledMessagesRequest,
  ListScheduledMessagesResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models";
import { SlackClientResolvedConfig } from "../SlackClient";
import { se_ListScheduledMessagesCommand, de_ListScheduledMessagesCommand } from "../protocols";

export interface ListScheduledMessagesCommandInput extends ListScheduledMessagesRequest {}
export interface ListScheduledMessagesCommandOutput extends MetadataBearer, ListScheduledMessagesResult {}

export class ListScheduledMessagesCommand extends SlackCommand<
  ListScheduledMessagesCommandInput,
  ListScheduledMessagesCommandOutput,
  SlackClientResolvedConfig
> {
  input: ListScheduledMessagesCommandInput;
  serializer: RequestSerializer<ListScheduledMessagesCommandInput, SlackClientResolvedConfig>;
  deserializer: ResponseDeserializer<ListScheduledMessagesCommandOutput, SlackClientResolvedConfig>;
  constructor(input: ListScheduledMessagesCommandInput) {
    super(input);
    const curr = new Date();
    const after_one_week_ms = curr.getTime() + getMsByDay(7);
    this.input = {
      oldest: input.oldest ? verifyDate(input.oldest) : curr.toISOString().replace(/\.\d{3}Z$/, "Z"),
      latest: input.latest
        ? verifyDate(input.latest)
        : new Date(after_one_week_ms).toISOString().replace(/\.\d{3}Z$/, "Z"),
      limit: input.limit && input.limit <= 100 ? input.limit : 20,
      ...(input.channel && { channel: input.channel }),
      ...(input.cursor && { cursor: input.cursor }),
      ...(input.team_id && { team_id: input.team_id }),
    };
    this.serializer = se_ListScheduledMessagesCommand;
    this.deserializer = de_ListScheduledMessagesCommand;
  }
}

const getMsByDay = (input: number) => input * 86400 * 1000;

const verifyDate = (input: string): string => {
  let error = new IngestkoreaError({
    code: 400,
    type: "Bad Request",
    message: "Invalid Request",
    description: "VerifyDate Error",
  });

  const isUTC = input.match(/Z/gi); // null
  const isDate = input.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/gi);
  if (!isUTC || !isDate) {
    error.error.description =
      "latest or oldest params type must be in UTC string format, such as 2025-02-15T12:35:17Z or 2025-02-15T12:35:17.456Z.";
    throw error;
  }

  return input.replace(/\.\d{3}Z$/, "Z");
};
