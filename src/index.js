const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");

(async () => {
  // Prompt the user for their API credentials and session string
  const apiId = await input.text("Please enter your API ID: ");
  const apiHash = await input.text("Please enter your API Hash: ");
  const sessionString = await input.text("Please enter your session string: ");

  // Initialize the Telegram client
  const stringSession = new StringSession(sessionString);
  const client = new TelegramClient(stringSession, parseInt(apiId), apiHash, {
    connectionRetries: 5,
  });

  // Authenticate the client
  await client.start({
    phoneNumber: async () => await input.text("Please enter your phone number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () => await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });

  console.log("You are now connected.");
  console.log("Your session string is: ", client.session.save());

  // Example of sending a message
  // await client.sendMessage("me", { message: "Hello!" });

  // Keep the process running
  process.stdin.resume();
})();
