import { Bot } from "grammy";
import { API_KEY, MY_ID } from "./config";
import { MessagesController } from "./MessagesController";

const bot = new Bot(API_KEY as string);
const messagesController = new MessagesController();

bot.on("message", async (ctx, next) => {
  const isAllowedUser = ctx.from.id === MY_ID;
  if (isAllowedUser) {
    return await next();
  }
})

bot.on("message:photo", async (ctx) => {
  return messagesController.handleMessages(ctx, "photo")
});

bot.on("message:video", async (ctx) => {
  return messagesController.handleMessages(ctx, "video")
})

console.log("Bot is up and running")
bot.start();