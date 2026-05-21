import { HttpHandlerErrorCode } from "@ingestkorea/util-http-handler";

type SlackClientSdkErrorCode = "SDK.AUTH_ERROR" | "SDK.GENERAL_ERROR" | "SDK.REQUEST_ERROR" | "SDK.UNKNOWN_ERROR";

export type SlackClientErrorCode = HttpHandlerErrorCode | SlackClientSdkErrorCode;

export class SlackClientError extends Error {
  public readonly code: SlackClientErrorCode;
  public readonly timestamp: string;
  constructor(input: { code: SlackClientErrorCode; message: string }) {
    super(input.message);
    this.name = "SlackClientError";
    this.code = input.code;
    this.timestamp = new Date().toISOString();
  }
}
