// Importing the necessary classes from the 'telegram' library
// Api: This class provides access to Telegram's API methods
// TelegramClient: This class is used to create a client instance to interact with the Telegram API
const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { CustomFile } = require("telegram/client/uploads");
const input = require("input");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const path = require("path");
const apiId = 17883771; // Your API ID
const apiHash = ""; // Your API Hash
const stringSession23 = new StringSession(); // fill this later with the value from session.save()
const axios = require("axios");

// Middleware to parse JSON bodies
app.use(bodyParser.json());

const done = [];

// Define a GET endpoint at /endpoint
app.get("/endpoint", async function (req, res) {
  console.log("Received a request.");
  console.log(req.query);
  const name = req.query.NAME; // Extract NAME from query parameters
  const record = req.query.RECORD; // Extract RECORD from query parameters

  // Construct the group name using the provided NAME and TYPE
  const groupName = "Mobula & " + name + " (" + req.query.TYPE + ")";

  // Create a new group and get the invite link
  const link = await createGroup(groupName);
  console.log(link);

  // If a record is provided, send it to the specified webhook
  if (record) {
    axios.post("https://hook.eu1.make.com/", {
      name: name,
      link: link,
      type: req.query.TYPE,
      record: record,
    });
  }

  // Respond with the invite link
  res.status(200);
  res.json({ link });
});

// Start the server and listen on port 20000
const listener = app.listen(20000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// Function to create a new Telegram group
async function createGroup(groupName) {
  return new Promise(async (r) => {
    // Create a new Telegram client instance
    const client = new TelegramClient(
      stringSession23,
      parseInt("17121374"),
      "",
      {
        connectionRetries: 5,
      }
    );

    // Start the client and authenticate
    await client.start({
      phoneNumber: async () => await input.text("number ?"),
      password: async () => await input.text("password?"),
      phoneCode: async () => await input.text("Code ?"),
      onError: (err) => console.log(err),
    });
    console.log("You should now be connected.");
    // console.log(client.session.save());

    // Create a new chat with the specified users and title
    const result = await client.invoke(
      new Api.messages.CreateChat({
        users: [
          "nbmsacha",
          "me",
        ],
        title: groupName,
      })
    );

    const chatId = result.chats[0].id; // Get the chat ID of the newly created chat

    // Wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Export an invite link for the chat
    const invite = await client.invoke(
      new Api.messages.ExportChatInvite({
        peer: chatId,
        legacyRevokePermanent: true,
      })
    );

    r(invite); // Resolve the promise with the invite link

    // Wait for 3 seconds
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Upload a profile picture and set it for the chat
    await client.invoke(
      new Api.messages.EditChatPhoto({
        chatId,
        photo: await client.uploadFile({
          file: new CustomFile(
            "profile.png",
            fs.statSync(path.resolve(__dirname, ".", "profile.png")).size,
            path.resolve(__dirname, ".", "profile.png")
          ),
          workers: 1,
        }),
      })
    );

    const admins = ["nbmsacha"]; // List of admins to be added

    // Loop through the admins and set them as admins in the chat
    for (const admin of admins) {
      try {
        // Wait for 2 seconds
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Set the user as an admin in the chat
        await client.invoke(
          new Api.messages.EditChatAdmin({
            chatId,
            userId: admin,
            isAdmin: true,
          })
        );
      } catch (e) {
        console.log("ERROR SAFE", e); // Log any errors
      }
    }
  });
}