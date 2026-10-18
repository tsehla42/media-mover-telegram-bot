import { Context } from "grammy";
import { sendErrorLog } from "../utils";
import { MY_ID } from "../config";

const COMMAND_PATTERN = /^\/\w+/;

export class TextMessageController {
  public async handleTextMessage(ctx: Context) {
    const text = ctx.message?.text;
    const messageId = ctx.message?.message_id;

    if (!text || messageId === undefined || COMMAND_PATTERN.test(text)) {
      return;
    }

    await this.deleteMessage(ctx, messageId);
  }

  private async deleteMessage(ctx: Context, messageId: number) {
    try {
      await ctx.api.deleteMessage(MY_ID, messageId);
    } catch (e) {
      await sendErrorLog(ctx, "Error while deleting text message", e);
    }
  }
}
