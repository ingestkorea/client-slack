export interface SendMessageInput extends MessagePayload {
  channel?: string;
}

export interface MessagePayload {
  text: string;
  blocks?: (SectionBlock | DividerBlock | HeaderBlock)[];
  thread_ts?: string;
  mrkdwn?: boolean; // default true
  response_url?: string;
  response_type?: "in_channel";
  replace_original?: boolean;
  delete_original?: boolean;
}

export interface SendMessageOutput {
  ok?: boolean; // all http response code is 200
  channel?: string;
  ts?: string;
  message?: ReceiveMessage;
  error?: string; // if error
  errors?: string[]; // if error
}

export type ReceiveMessage = {
  user?: string;
  type?: "message";
  ts?: string;
  bot_id?: string;
  app_id?: string;
  text?: string;
  team?: string;
  bot_profile?: BotFrofile;
  blocks?: (Partial<SectionBlock> | Partial<DividerBlock> | Partial<HeaderBlock>)[];
};

export interface BotFrofile {
  id?: string;
  app_id?: string;
  name?: string;
  icons?: Icons;
  deleted?: boolean;
  updated?: number;
  team_id?: string;
}

export interface SectionBlock {
  type: "section";
  text?: PlainText | Markdown;
  fields?: (PlainText | Markdown)[]; // 2000
  block_id?: string;
  accessory?: ButtonElement; // https://api.slack.com/reference/block-kit/blocks#section
  // expand?: boolean;
}

export interface DividerBlock {
  type: "divider";
  block_id?: string;
}

export interface HeaderBlock {
  type: "header";
  text: PlainText;
  block_id?: string;
}

export type PlainText = {
  type: "plain_text";
  text: string; // 3000
  emoji?: boolean;
  verbatim?: boolean; // default false
};

export type Markdown = {
  type: "mrkdwn";
  text: string; // 3000
  verbatim?: boolean;
};

export type Icons = {
  image_36?: string;
  image_48?: string;
  image_72?: string;
};

export type ButtonElement = {
  type: "button";
  text: PlainText;
  action_id?: string;
  url?: string;
  value?: string;
  style?: "primary" | "danger";
  confirm?: Confirmation;
};

export type Confirmation = {
  title: PlainText;
  text: PlainText;
  confirm: PlainText;
  deny: PlainText;
  style?: "primary" | "danger";
  accessibility_label?: string;
};
