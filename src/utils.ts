import { Context } from "grammy";
import { EntityType, MediaEntity } from "./types";
import { MY_ID } from "./config";

export const extractMessagePropertiesFromContext = (ctx: Context, entityType: EntityType) => {
  return {
    entity: ctx.message?.[entityType] as MediaEntity,
    messageId: ctx.message?.message_id as number,
    mediaGroupId: ctx.message?.media_group_id,
  };
};

export const sendTextMessage = async (ctx: Context, content: string, options?: { parse_mode: "MarkdownV2" }) => {
  try {
    return await ctx.api.sendMessage(MY_ID, content, options);
  } catch (e) {
    console.log("Fatal error. Cannot send text message.\n", e);
  }
};

export const sendErrorLog = async (ctx: Context, reason: string, error: unknown) => {
  console.log(error);
  const ticks = "```";
  const errorMessage = `${ticks}\n${ String(error) }\n${ticks}`
  return await sendTextMessage(ctx, `${ reason }:\n\n ${errorMessage}`);
};

export const delay = (ms: number) => {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
};
