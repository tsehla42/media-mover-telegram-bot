import { Context } from "grammy";
import { sendErrorLog, sendTextMessage } from "../utils";

interface StringBuilderParams {
  status: string,
  chatId: number,
  chatTitle?: string,
  inviterUserId: number,
  inviterUsername?: string
}

export class GroupChatNotificationController {
  private static textMessageStringBuilder({ status, chatId, chatTitle, inviterUserId, inviterUsername }: StringBuilderParams) {
    const botChatActionAdded = ["member", "administrator"].includes(status);
    const botChatActionText = `Bot was \*${ botChatActionAdded ? "added to" : "removed from" }\*`;

    const chatName = chatTitle ? `\*"${chatTitle}"\*` : "without title";
    const chatInfoText = `chat ${ chatName }\nchatId: \`${ chatId }\`\n`;

    const userInfo = inviterUsername ? `@${inviterUsername}` : "user without username";
    const userInfoText = `${ userInfo }\nuserId: \`${ inviterUserId }\``;
    if (chatId === inviterUserId) {
      return `Bot was started by ${userInfoText}`
    }

    return `${ botChatActionText } ${ chatInfoText }by ${ userInfoText }`;
  }

  public async onChatJoin(ctx: Context) {
    try {
      if (!ctx.from || !ctx.chat || !ctx.myChatMember) {
        return;
      }
      const { id: inviterUserId, username: inviterUsername } = ctx.from;
      const { id: chatId, title: chatTitle } = ctx.chat;
      const { status } = ctx.myChatMember.new_chat_member;
      const logText = GroupChatNotificationController.textMessageStringBuilder({ status, chatId, chatTitle, inviterUserId, inviterUsername });

      console.log(logText);
      return sendTextMessage(ctx, logText, { parse_mode: "MarkdownV2" });
    } catch (error) {
      await sendErrorLog(ctx, "Unknown error occurred", error);
    }
  }
}