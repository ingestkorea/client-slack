export interface SendMessageRequest extends MessagePayloadForInteraction {
  channel?: string;
  text: string;
  blocks?: SupportBlock[];
  thread_ts?: string;
  mrkdwn?: boolean; // default true
}

export interface MessagePayloadForInteraction {
  response_url?: string;
  response_type?: "in_channel";
  replace_original?: boolean; // default true
  delete_original?: boolean; // default true
}

export interface SendMessageResult {
  ok?: boolean;
  channel?: string;
  message?: ReceiveMessage;
  ts?: string;
  error?: string;
  errors?: string[];
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
  blocks?: SupportBlock[];
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
  text?: SupportTextType;
  block_id?: string;
  fields?: SupportTextType[]; // 2000
  accessory?: SupportElement; // https://api.slack.com/reference/block-kit/blocks#section
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

export type SupportBlock = SectionBlock | DividerBlock | HeaderBlock;
export type SupportTextType = PlainText | Markdown;
export type SupportElement = ButtonElement;

export type PlainText = CommonText & {
  type: "plain_text";
  emoji?: boolean;
};

export type Markdown = CommonText & {
  type: "mrkdwn";
};

type CommonText = {
  text: string; // max 3000
  verbatim?: boolean; //default false
};

export type Icons = {
  image_36?: string;
  image_48?: string;
  image_72?: string;
};

export type ButtonElement = {
  type: "button";
  text: PlainText;
  value?: string;
  style?: "primary" | "danger";
  action_id?: string;
  url?: string;
  confirm?: Confirmation;
};

export type Confirmation = {
  title: PlainText;
  text: PlainText;
  confirm: PlainText;
  deny: PlainText;
  style?: "primary" | "danger";
};
