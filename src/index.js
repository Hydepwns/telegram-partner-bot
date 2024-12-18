const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const dotenv = require('dotenv');
dotenv.config();

let stringSession = process.env.STRING_SESSION;

async function generateSession() {
  const apiId = process.env.API_ID;
  const apiHash = process.env.API_HASH;
  const client = new TelegramClient(new StringSession(""), apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("Please enter your phone number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () => await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });

  console.log("You are now connected.");
  stringSession = client.session.save();
  console.log("Your session string is: ", stringSession);
  await client.disconnect();
}

(async () => {
  if (!stringSession) {
    console.log("Generating new session string...");
    await generateSession();
  }

  const client = new TelegramClient(new StringSession(stringSession), process.env.API_ID, process.env.API_HASH, {
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
    if (message.text.startsWith('/start')) {
      await message.reply(
        'Welcome! Here are the available commands:\n' +
        '/set <key> <value> - Update configuration values\n\n' +
        '**Warning**: Setting the `API_ID` and `API_HASH` allows the bot to access your Telegram account and perform actions on your behalf. ' +
        'Ensure these values are kept secure.\n\n' +
        'You can obtain these values by creating a new application on the Telegram API Development Tools page: https://my.telegram.org/apps'
      );
    } else if (message.text.startsWith('/set')) {
      const [command, key, value] = message.text.split(' ');
      if (key && value) {
        process.env[key.toUpperCase()] = value;
        await message.reply(`Configuration updated: ${key} = ${value}`);
      } else {
        await message.reply('Usage: /set API_ID API_HASH');
      }
    }
  });

  console.log("Bot is running...");
})();
