export type SlackClientErrorType = "AUTH_ERROR" | "GENERAL_ERROR" | "REQUEST_ERROR" | "UNKNOWN_ERROR";

export class SlackClientError extends Error {
  public readonly name: string;
  public readonly timestamp: string;
  public readonly type: SlackClientErrorType;
  constructor(info: { type?: SlackClientErrorType; message: string }) {
    const { type = "GENERAL_ERROR", message } = info;
    super(message);
    this.name = `SDK.${type}`;
    this.type = type;
    this.timestamp = new Date().toISOString();
  }
}
