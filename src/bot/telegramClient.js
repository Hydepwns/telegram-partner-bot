const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");

const apiId = 17883771; // Replace with your API ID
const apiHash = ""; // Replace with your API Hash
const stringSession23 = new StringSession(""); // Initialize with session data

async function initializeTelegramClient() {
  return new TelegramClient(stringSession23, apiId, apiHash, {
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