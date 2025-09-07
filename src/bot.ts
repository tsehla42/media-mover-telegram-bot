import { Bot } from "grammy";
import { API_KEY, MY_ID } from "./config";
import { MessagesController } from "./MessagesController";
import { CommandsController, GroupChatNotificationController } from "./controllers";

const bot = new Bot(API_KEY as string);

const messagesController = new MessagesController();
const commandsController = new CommandsController();
const groupChatNotificationController = new GroupChatNotificationController();

bot.on("message", async (ctx, next) => {
  const isAllowedUser = ctx.from.id === MY_ID;
  if (isAllowedUser || ctx.message.text === "/my_id") {
    return await next();
  }
});

bot.on("message:photo", async (ctx) => {
  return messagesController.handleMessages(ctx, "photo");
});

bot.on("message:video", async (ctx) => {
  return messagesController.handleMessages(ctx, "video");
});

bot.on("my_chat_member", groupChatNotificationController.onChatJoin);

bot.command("my_id", commandsController.getCurrentUserId);

bot.command("chat_id", commandsController.getCurrentGroupChatId);

const startBot = async () => {
  await commandsController.setCommands();
  await bot.start();
};

console.log("Bot is up and running");
startBot();