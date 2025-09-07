import { Bot, Context } from "grammy";
import { sendErrorLog, sendTextMessage } from "../utils";
import { MY_ID } from "../config";

export class CommandsController {
  public async setCommands() {
    return Promise.all([this.setPrivateChatCommands, this.setGroupChatCommands]);
  }

  private async setPrivateChatCommands(bot: Bot) {
    return bot.api.setMyCommands(
      [
        { command: "start", description: "Start the bot" },
        { command: "my_id", description: "Get current user id" },
      ],
      { scope: { type: "all_private_chats" } },
    );
  }

  private async setGroupChatCommands(bot: Bot) {
    return bot.api.setMyCommands(
      [{
        command: "chat_id",
        description: "Get current chat id",
      }],
      { scope: { type: "all_group_chats" } },
    );
  }

  async getCurrentUserId(ctx: Context) {
    try {
      if (!!ctx.from) {
        const senderId = ctx.from.id;
        if (senderId !== MY_ID) {
          await sendTextMessage(ctx, ctx.from.id.toString());
        }
        return ctx.reply(ctx.from.id.toString());
      }
    } catch (error) {
      await sendErrorLog(ctx, "Cannot retrieve current user id", error);
    }
  }

  async getCurrentGroupChatId(ctx: Context) {
    try {
      if (!ctx.chat) {
        return new Error("Chat ID does not exist");
      }
      const { id: chatId, type } = ctx.chat;
      const reply = `Chat ID: \`${ chatId }\`\nChat type: ${ type }`;
      await ctx.reply(reply, { parse_mode: "MarkdownV2" });
    } catch (error) {
      await sendErrorLog(ctx, "Cannot retrieve current chat id", error);
    }
  }
}