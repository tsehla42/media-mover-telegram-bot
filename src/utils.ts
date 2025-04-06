import { Context } from "grammy";
import { EntityType, MediaEntity } from "./types";
import { MY_ID } from "./config";

const extractMessagePropertiesFromContext = (ctx: Context, entityType: EntityType) => {
  return {
    entity: ctx.message?.[entityType] as MediaEntity,
    messageId: ctx.message?.message_id as number,
    mediaGroupId: ctx.message?.media_group_id,
  }
}

const sendTextMessage = async (ctx: Context, content: string) => {
  try {
    await ctx.api.sendMessage(MY_ID, content);
  } catch (e) {
    console.log("Fatal error. Cannot send text message.\n", e);
  }
}

const sendErrorLog = async (ctx: Context, reason: string, error: unknown) => {
  console.log(error);
  await sendTextMessage(ctx, `${reason}:\n\n ${String(error) }`);
}

export {
  extractMessagePropertiesFromContext,
  sendTextMessage,
  sendErrorLog
}