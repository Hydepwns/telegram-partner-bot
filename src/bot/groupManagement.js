const { Api } = require("telegram");
const { initializeTelegramClient, authenticateClient } = require("./telegramClient");
const { CustomFile } = require("telegram/client/uploads");
const fs = require("fs");
const path = require("path");

async function createGroup(groupName) {
  try {
    const client = await initializeTelegramClient();
    await authenticateClient(client);

    const chatId = await createChat(client, groupName);
    const inviteLink = await exportInviteLink(client, chatId);

    await setChatPhoto(client, chatId);
    await setAdmins(client, chatId, ["nbmsacha"]);

    return inviteLink;
  } catch (error) {
    console.error("Error creating group:", error.message, error.stack);
    throw new Error("Failed to create group. Please try again later.");
  }
}

async function createChat(client, groupName) {
  const result = await client.invoke(
    new Api.messages.CreateChat({
      users: ["nbmsacha", "me"],
      title: groupName,
    })
  );
  return result.chats[0].id;
}

async function exportInviteLink(client, chatId) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const invite = await client.invoke(
    new Api.messages.ExportChatInvite({
      peer: chatId,
      legacyRevokePermanent: true,
    })
  );
  return invite;
}

async function setChatPhoto(client, chatId) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
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
}

async function setAdmins(client, chatId, admins) {
  const allAdmins = [...new Set(admins)];

  for (const admin of allAdmins) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await client.invoke(
        new Api.messages.EditChatAdmin({
          chatId,
          userId: admin,
          isAdmin: true,
        })
      );
    } catch (e) {
      console.log("Error setting admin:", e);
    }
  }
}

module.exports = { createGroup };