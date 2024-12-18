const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const dotenv = require('dotenv');
dotenv.config();

const apiId = process.env.API_ID; // Use environment variable
const apiHash = process.env.API_HASH; // Use environment variable
const stringSession = new StringSession(process.env.STRING_SESSION); // Use environment variable

async function setupClient() {
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("Please enter your phone number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () => await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });

  return client;
}

module.exports = { setupClient };