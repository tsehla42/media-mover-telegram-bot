import { Context } from "grammy";
import { EntityType, MediaEntity } from "./types";

export const extractMessagePropertiesFromContext = (ctx: Context, entityType: EntityType) => {
  return {
    entity: ctx.message?.[entityType] as MediaEntity,
    messageId: ctx.message?.message_id as number,
    mediaGroupId: ctx.message?.media_group_id,
  }
}