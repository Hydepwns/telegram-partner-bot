const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const dotenv = require('dotenv');
dotenv.config();

const apiId = process.env.API_ID;
const apiHash = process.env.API_HASH;
const stringSession = new StringSession(process.env.STRING_SESSION);

(async () => {
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("Please enter your phone number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () => await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });

  client.addEventHandler(async (event) => {
    const message = event.message;
    if (message.text.startsWith('/set')) {
      const [command, key, value] = message.text.split(' ');
      if (key && value) {
        process.env[key.toUpperCase()] = value;
        await message.reply(`Configuration updated: ${key} = ${value}`);
      } else {
        await message.reply('Usage: /set <key> <value>');
      }
    }
  });

  console.log("Bot is running...");
})();
