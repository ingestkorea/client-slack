import {
  SlackClientResolvedConfig,
  SlackCommand,
  ListScheduledMessagesRequest,
  ListScheduledMessagesResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
  SlackClientError,
} from "../models/index.js";
import { se_ListScheduledMessagesCommand, de_ListScheduledMessagesCommand } from "../protocols/index.js";

export type ListScheduledMessagesCommandInput = ListScheduledMessagesRequest;
export type ListScheduledMessagesCommandOutput = MetadataBearer & ListScheduledMessagesResult;

const DEFAULT_RANGE = 7 * 86400 * 1000;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

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
    const default_oldest = curr.toISOString();
    const default_latest = new Date(curr.getTime() + DEFAULT_RANGE).toISOString();

    this.input = {
      oldest: resolveDate(input.oldest || default_oldest),
      latest: resolveDate(input.latest || default_latest),
      limit: Math.min(MAX_LIMIT, Math.max(1, input.limit ?? DEFAULT_LIMIT)),
      ...(input.channel && { channel: input.channel }),
      ...(input.cursor && { cursor: input.cursor }),
      ...(input.team_id && { team_id: input.team_id }),
    };
    this.serializer = se_ListScheduledMessagesCommand;
    this.deserializer = de_ListScheduledMessagesCommand;
  }
}

const resolveDate = (input: string): string => {
  const utcZRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

  if (!utcZRegex.test(input)) {
    throw new SlackClientError({
      code: "SDK.GENERAL_ERROR",
      message: "date type must be in UTC string format, such as 2025-02-15T12:35:17.456Z",
    });
  }

  return input.replace(/\.\d+Z$/, "Z");
};
