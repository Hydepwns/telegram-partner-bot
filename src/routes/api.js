const express = require('express');
const router = express.Router();
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

router.post('/generate-session', async (req, res) => {
  try {
    if (!stringSession) {
      console.log("Generating new session string...");
      await generateSession();
    }
    res.status(200).json({ message: "Session generated successfully", session: stringSession });
  } catch (error) {
    res.status(500).json({ message: "Error generating session", error: error.message });
  }
});

module.exports = router;
