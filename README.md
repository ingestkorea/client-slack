# @ingestkorea/client-slack

[![npm (scoped)](https://img.shields.io/npm/v/@ingestkorea/client-slack?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-slack)
[![npm downloads](https://img.shields.io/npm/dm/@ingestkorea/client-slack?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-slack)
[![license](https://img.shields.io/github/license/ingestkorea/client-slack?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-slack)

## Description

INGESTKOREA SDK Slack Client for Node.js.

## Installing

```sh
npm install @ingestkorea/client-slack
```

## Getting Started

### Pre-requisites

- Use TypeScript v5.x
- Includes the TypeScript definitions for node.
  ```sh
  npm install -D @types/node # save dev mode
  ```

### Support Methods

- SendMessage

### Import

```ts
import { SlackClient, SendMessageCommand, SendMessageCommandInput } from "@ingestkorea/client-slack";
```

### Usage

To send a request, you:

- Initiate client with configuration.
- Initiate command with input parameters.
- Call `send` operation on client with command object as input.

```ts
// a client can be shared by different commands.
const client = new SlackClient({
  credentials: {
    token: "YOUR_TOKEN", // required
    channel: "YOUR_CHANNEL_ID", // required
  },
});
```

#### SendMessageCommand (Simple)

```ts
const params: SendMessageCommandInput = {
  text: "Hello client-slack : " + new Date().toISOString(), // required
  channel: "YOUR_CHANNEL_ID", // optional // this channelId override SlackClient config
};

const command = new SendMessageCommand(params);
```

#### SendMessageCommand (with Blocks)

Support Blocks:

- HeaderBlock
- DividerBlock
- SectionBlock

```ts
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

#### Async/await

```ts
(async () => {
  try {
    const data = await client.send(command);
    console.dir(data, { depth: 4 });
  } catch (err) {
    console.log(err);
  }
})();
```

#### Promises

```ts
client
  .send(command)
  .then((data) => console.dir(data, { depth: 4 }))
  .catch((err) => console.log(err));
```

## License

This SDK is distributed under the [MIT License](https://opensource.org/licenses/MIT), see LICENSE for more information.
