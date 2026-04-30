export type SlackAPISuccess = {
  ok: true;
};

export type SlackAPIFailure = {
  ok: false;
  error: string;
  errors: string[];
};

export type SlackAPIResult<T> = (SlackAPISuccess & T) | SlackAPIFailure;
