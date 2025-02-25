# @ingestkorea/client-slack

[![npm (scoped)](https://img.shields.io/npm/v/@ingestkorea/client-slack?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-slack)
[![npm downloads](https://img.shields.io/npm/dm/@ingestkorea/client-slack?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-slack)
[![license](https://img.shields.io/github/license/ingestkorea/client-slack?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-slack)

## Description

INGESTKOREA SDK - Slack Client for Node.js.

INGESTKOREA SDK - Slack Client for Node.js is a lightweight library that contains only the essential features frequently used in Slack bots.

This SDK performs tasks such as the following automatically.

- Authentication using an Bot User OAuth Token
- Retry requests
- Handle error responses

## Installing

```sh
npm install @ingestkorea/client-slack
```

## Getting Started

### Pre-requisites

[Slack](https://api.slack.com/apps)

- Create the app in your workspace.
- Add the `chat:write` scope to the `Bot Token Scopes` under the `OAuth & Permissions` category.
- Generate a `OAuth Token` under the `OAuth & Permissions` category. (A token is automatically generated when you installed the app to your workspace)
- Enter `/invite @YOUR_APP_NAME` in the channel where you want to add the bot.

Node.js

- Use TypeScript v5.x
- Includes the TypeScript definitions for node.

  ```sh
  npm install -D @types/node # save dev mode
  ```

### Support Methods

- SendMessage
- DeleteMessage
- UpdateMessage
- SendScheduleMessage
- DeleteScheduledMessage
- ListScheduledMessages

### Import

The INGESTKOREA SDK - Slack Client is modulized by `client` and `commands`.

To send a request, you only need to import the SlackClient and the commands you need, for example SendMessageCommand:

```ts
import { SlackClient, SendMessageCommand } from "@ingestkorea/client-slack";
```

### Usage

To send a request, you:

- Initiate client with configuration.
- Initiate command with input parameters.
- Call `send` operation on client with command object as input.

```ts
import { SendMessageCommandInput } from "@ingestkorea/client-slack";

// a client can be shared by different commands.
const client = new SlackClient({
  credentials: {
    token: "YOUR_OAuth_TOKEN", // required // xoxb-xxxxxxxx
    channel: "YOUR_CHANNEL_ID", // required
  },
});

const params: SendMessageCommandInput = {
  text: "Hello client-slack : " + new Date().toISOString(), // required
  channel: "YOUR_CHANNEL_ID", // optional // this channelId overrides SlackClient config
};

const command = new SendMessageCommand(params);
```

#### SendMessage (with Blocks)

These are the currently supported Blocks, and more will be added in the future.

- HeaderBlock
- DividerBlock
- SectionBlock

If you need more information about Blocks, please visit [Slack Blocks Reference](https://api.slack.com/reference/block-kit/blocks)

```ts
import { SendMessageCommand, SendMessageCommandInput } from "@ingestkorea/client-slack";

const params: SendMessageCommandInput = {
  text: "Hello client-slack : " + new Date().toISOString(),
  blocks: [
    { type: "header", text: { type: "plain_text", text: "This is HeaderBlock" } },
    { type: "divider" },
    {
      type: "section",
      text: { type: "mrkdwn", text: "*This is SectionBlock_01*" },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: "_This is SectionBlock_02-1_" },
        { type: "plain_text", emoji: true, text: "This is SectionBlock_02-2" },
      ],
    },
    {
      type: "section",
      text: { type: "plain_text", text: "This is SectionBlock_03" },
      fields: [
        { type: "mrkdwn", text: "_This is SectionBlock_03-1_" },
        { type: "plain_text", emoji: true, text: "This is SectionBlock_03-2" },
      ],
    },
  ],
};

const command = new SendMessageCommand(params);
```

#### DeleteMessage

- If you provide the channel ID as an input to the command object, it will override the SlackClient configuration.

```ts
import { DeleteMessageCommand, DeleteMessageCommandInput } from "@ingestkorea/client-slack";

const params: DeleteMessageCommandInput = {
  ts: "1234567890.123456", // required
};

const command = new DeleteMessageCommand(params);
```

#### UpdateMessage

- If you provide the channel ID as an input to the command object, it will override the SlackClient configuration.

```ts
import { UpdateMessageCommand, UpdateMessageCommandInput } from "@ingestkorea/client-slack";

const params: UpdateMessageCommandInput = {
  ts: "1234567890.123456", // required
  text: "Hello client-slack", // required
};

const command = new UpdateMessageCommand(params);
```

#### SendScheduleMessage

Usage info

- SendScheduleMessageCommand is an extension of SendMessageCommand.
- `post_at` type must be in UTC string format, such as `2025-02-15T12:35:17Z` or `2025-02-15T12:35:17.456Z`.
- `post_at` must differ from the current time by at least `30 seconds`.
- You can only delete a scheduled message if post_at differs from request_time by at least `10 minutes`.
- If you provide the channel ID as an input to the command object, it will override the SlackClient configuration.

```ts
import { SendScheduleMessageCommand, SendScheduleMessageCommandInput } from "@ingestkorea/client-slack";

const params: SendScheduleMessageCommandInput = {
  post_at: "2025-02-15T12:35:17.456Z", // required
  text: "Hello client-slack", // required
};

const command = new SendScheduleMessageCommand(params);
```

#### DeleteScheduledMessage

Usage info

- You can only delete a scheduled message if `post_at` differs from request_time by at least `10 minutes`.
- If you provide the channel ID as an input to the command object, it will override the SlackClient configuration.

```ts
import { DeleteScheduledMessageCommand, DeleteScheduledMessageCommandInput } from "@ingestkorea/client-slack";

const params: DeleteScheduledMessageCommandInput = {
  scheduled_message_id: "xxxxx", // required
};

const command = new DeleteScheduledMessageCommand(params);
```

#### ListScheduledMessages

Usage info

- `latest` or `oldest` params type must be in UTC string format, such as `2025-02-15T12:35:17Z` or `2025-02-15T12:35:17.456Z`.
- If you provide the channel ID as an input to the command object, it will override the SlackClient configuration.
- The results are sorted in ascending order by `post_at`.

```ts
import { ListScheduledMessagesCommand, ListScheduledMessagesCommandInput } from "@ingestkorea/client-slack";

const params: ListScheduledMessagesCommandInput = {
  oldest: "2025-02-20T12:35:17.456Z", // optional // default: current
  latest: "2025-02-27T12:35:17.456Z", // optional // default: current + 7 days
  limit: 1 ~ 100, // optional // default: 20 // max: 100
  cursor: "xxxxx", // optional
  team_id: "xxxx", // optional
};

const command = new ListScheduledMessagesCommand(params);
```

#### Async/await

We recommend using `await` operator to wait for the promise returned by send operation as follows:

```ts
(async () => {
  const start = process.hrtime.bigint();
  try {
    // a client can be shared by different commands.
    const data = await client.send(command);
    console.dir(data, { depth: 5 });
  } catch (err) {
    console.log(err);
  } finally {
    let end = process.hrtime.bigint();
    let duration = Number(end - start) / 1000000;
    console.log("duration: " + duration + "ms");
  }
})();
```

#### Promises

- You can also use Promise chaining to execute send operation.
- Promises can also be called using .catch() and .finally() as follows:

```ts
const start = process.hrtime.bigint();

client
  .send(command)
  .then((data) => {
    console.dir(data, { depth: 5 });
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    let end = process.hrtime.bigint();
    let duration = Number(end - start) / 1000000;
    console.log("duration: " + duration + "ms");
  });
```

## Getting Help

We use the GitHub issues for tracking bugs and feature requests.

If it turns out that you may have found a bug, please open an issue.

## License

This SDK is distributed under the [MIT License](https://opensource.org/licenses/MIT), see LICENSE for more information.

## Client Commands

### SendMessage

| Arguments | Type     | Required | Description                                                                                                               |
| --------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| text      | string   | true     | Describe the content of the message. When blocks are included, text will be used as fallback text for notifications only. |
| channel   | string   | false    | This channelId overrides SlackClient config.                                                                              |
| blocks    | object[] | false    | Array of SupportBlocks.                                                                                                   |
| thread_ts | string   | false    | Provide another message's ts value to make this message a reply.                                                          |
| mrkdwn    | boolean  | false    | Disable Slack markup parsing by setting to false. Enabled by default.                                                     |

### DeleteMessage

| Arguments | Type   | Required | Description                                 |
| --------- | ------ | -------- | ------------------------------------------- |
| ts        | string | true     | Timestamp of the message to be deleted.     |
| channel   | string | false    | This channelId overrides SlackClient config |

### UpdateMessage

| Arguments | Type     | Required | Description                                                                                                               |
| --------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| ts        | string   | true     | Timestamp of the message to be updated.                                                                                   |
| text      | string   | true     | Describe the content of the message. When blocks are included, text will be used as fallback text for notifications only. |
| channel   | string   | false    | This channelId overrides SlackClient config.                                                                              |
| blocks    | object[] | false    | Array of SupportBlocks.                                                                                                   |

### SendScheduleMessage

| Arguments | Type     | Required | Description                                                                                                               |
| --------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| post_at   | string   | true     | UTC ISO8601 format representing the future time the message should post to Slack. (ex.2025-02-20T12:35:17.456Z)           |
| text      | string   | true     | Describe the content of the message. When blocks are included, text will be used as fallback text for notifications only. |
| channel   | string   | false    | This channelId overrides SlackClient config                                                                               |
| blocks    | object[] | false    | Array of SupportBlocks.                                                                                                   |
| thread_ts | string   | false    | Provide another message's ts value to make this message a reply.                                                          |

### DeleteScheduledMessage

| Arguments            | Type   | Required | Description                                                                                 |
| -------------------- | ------ | -------- | ------------------------------------------------------------------------------------------- |
| scheduled_message_id | string | true     | scheduled_message_id returned from call to `SendScheduleMessage` or `ListScheduledMessages` |
| channel              | string | false    | This channelId overrides SlackClient config                                                 |

### ListScheduledMessages

| Arguments | Type    | Required | Description                                                                                                        |
| --------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| channel   | string  | false    | This channelId overrides SlackClient config                                                                        |
| cursor    | string  | false    | For pagination                                                                                                     |
| oldest    | string  | false    | UTC ISO8601 format of the oldest value in the time range. default: current. (ex.2025-02-20T12:35:17.456Z)          |
| latest    | string  | false    | UTC ISO8601 format of the latest value in the time range. default: current + 7 days. (ex.2025-02-27T12:35:17.456Z) |
| limit     | integer | false    | Maximum number of original entries to return. default: 20. max: 100                                                |
| team_id   | string  | false    | Encoded team id to list channels in, required if org token is used                                                 |
