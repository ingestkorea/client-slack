# @ingestkorea/client-slack

[![npm (scoped)](https://img.shields.io/npm/v/@ingestkorea/client-slack?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-slack)
[![npm downloads](https://img.shields.io/npm/dm/@ingestkorea/client-slack?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-slack)
[![license](https://img.shields.io/github/license/ingestkorea/client-slack?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-slack)

## Description

INGESTKOREA SDK Slack Client for Node.js.

INGESTKOREA SDK Slack Client for Node.js is a lightweight library that includes only the essential features commonly used in Slack bots.

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

- Install the app in your workspace and generate a `Bot User OAuth Token` under the `OAuth & Permissions` category.
- Add the `chat:write` scope to the Bot Token Scopes.

Node.js

- Use TypeScript v5.x
- Includes the TypeScript definitions for node.

  ```sh
  npm install -D @types/node # save dev mode
  ```

### Support Methods

- SendMessage
- DeleteMessage
- SendScheduleMessage
- DeleteScheduledMessage
- ListScheduledMessage

### Import

The INGESTKOREA SDK Slack is modulized by `client` and `commands`. To send a request, you only need to import the SlackClient and the commands you need, for example SendMessageCommand:

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
  channel: "YOUR_CHANNEL_ID", // optional // this channelId override SlackClient config
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
  text: "hello client-slack : " + new Date().toISOString(),
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

```ts
import { DeleteMessageCommand, DeleteMessageCommandInput } from "@ingestkorea/client-slack";

const params: DeleteMessageCommandInput = {
  ts: "1234567890.123456", // required
  channel: "YOUR_CHANNEL_ID", // optional // this channelId override SlackClient config
};

const command = new DeleteMessageCommand(params);
```

#### SendScheduleMessage

Usage info

1. SendScheduleMessageCommand is an extension of SendMessageCommand.
2. `post_at` type must be in UTC string format, such as `2025-02-15T12:35:17Z` or `2025-02-15T12:35:17.456Z`.
3. `post_at` must differ from the current time by at least `30 seconds`.
4. You can only delete a scheduled message if post_at differs from request_time by at least `10 minutes`.

```ts
import { SendScheduleMessageCommand, SendScheduleMessageCommandInput } from "@ingestkorea/client-slack";

const params: SendScheduleMessageCommandInput = {
  text: "hello client-slack", // required
  post_at: "2025-02-15T12:35:17.456Z", // required
  channel: "YOUR_CHANNEL_ID", // optional // this channelId override SlackClient config
};

const command = new SendScheduleMessageCommand(params);
```

#### DeleteScheduledMessage

Usage info

1. You can only delete a scheduled message if `post_at` differs from request_time by at least `10 minutes`.

```ts
import { DeleteScheduledMessageCommand, DeleteScheduledMessageCommandInput } from "@ingestkorea/client-slack";

const params: DeleteScheduledMessageCommandInput = {
  scheduled_message_id: "xxxxx", // required
  channel: "YOUR_CHANNEL_ID", // optional // this channelId override SlackClient config
};

const command = new DeleteScheduledMessageCommand(params);
```

#### ListScheduledMessage

Usage info

- `latest` or `oldest` params type must be in UTC string format, such as `2025-02-15T12:35:17Z` or `2025-02-15T12:35:17.456Z`.

```ts
import { ListScheduledMessageCommand, ListScheduledMessageCommandInput } from "@ingestkorea/client-slack";

const params: ListScheduledMessageCommandInput = {
  channel: "YOUR_CHANNEL_ID", // optional // this channelId override SlackClient config
  cursor: "xxxxx", // optional
  latest: "2025-02-20T12:35:17.456Z", // optional // default: current
  oldest: "2025-02-27T12:35:17.456Z", // optional // default: current + 7 days
  limit: 1 ~ 100, // optional // default: 20 // max: 100
  team_id: "xxxx", // optional
};

const command = new ListScheduledMessageCommand(params);
```

#### Async/await

We recommend using `await` operator to wait for the promise returned by send operation as follows:

```ts
(async () => {
  try {
    // a client can be shared by different commands.
    const data = await client.send(command);
    console.dir(data, { depth: 4 });
  } catch (err) {
    console.log(err);
  }
})();
```

#### Promises

- You can also use Promise chaining to execute send operation.
- Promises can also be called using .catch() and .finally() as follows:

```ts
client
  .send(command)
  .then((data) => console.dir(data, { depth: 4 }))
  .catch((err) => console.log(err));
```

## Getting Help

We use the GitHub issues for tracking bugs and feature requests.

If it turns out that you may have found a bug, please open an issue.

## License

This SDK is distributed under the [MIT License](https://opensource.org/licenses/MIT), see LICENSE for more information.
