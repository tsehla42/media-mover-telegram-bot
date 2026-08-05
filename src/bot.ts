import { Bot } from "grammy";
import { autoRetry } from "@grammyjs/auto-retry";
import { run } from "@grammyjs/runner";
import { API_KEY, MY_ID } from "./config";
import { MessagesController } from "./MessagesController";
import { CommandsController, GroupChatNotificationController } from "./controllers";

const bot = new Bot(API_KEY as string);
bot.api.config.use(autoRetry());

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

bot.on("message:animation", async (ctx) => {
  return messagesController.handleMessages(ctx, "animation");
})

bot.on("my_chat_member", groupChatNotificationController.onChatJoin);

bot.command("my_id", commandsController.getCurrentUserId);

bot.command("chat_id", commandsController.getCurrentGroupChatId);

bot.catch((errorContext) => {
  console.error(`${ errorContext.name } timestamp: `, new Date().toLocaleString("uk-UA"));
  console.log("errorContext.error", errorContext.error);
  console.log("errorContext.message", errorContext.message);

  if (errorContext.cause) {
    console.log("Cause: ", errorContext.cause);
  }
});

const runner = run(bot);

const stopRunner = () => runner.isRunning() && runner.stop();
process.once("SIGINT", stopRunner);
process.once("SIGTERM", stopRunner);

const startBot = async () => {
  await commandsController.setCommands();
  console.log("Bot is up and running");
};

startBot().catch(console.error);