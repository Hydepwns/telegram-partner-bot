const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const dotenv = require('dotenv');
dotenv.config();

const apiId = process.env.API_ID; // Use environment variable
const apiHash = process.env.API_HASH; // Use environment variable
const stringSession = new StringSession(process.env.STRING_SESSION); // Use environment variable

async function initializeTelegramClient() {
  return new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
}

async function authenticateClient(client) {
  await client.start({
    phoneNumber: async () => await input.text("number ?"),
    password: async () => await input.text("password?"),
    phoneCode: async () => await input.text("Code ?"),
    onError: (err) => console.log(err),
  });
  console.log("Connected.");
}

module.exports = { initializeTelegramClient, authenticateClient };