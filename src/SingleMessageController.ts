import { Context } from "grammy";
import { EntityType, MediaEntity, SendMethodName } from "./types";
import { MY_ID, PHOTO_CHAT_ID, VIDEO_CHAT_ID } from "./config";
import { extractMessagePropertiesFromContext, sendErrorLog } from "./utils";
import { Animation, PhotoSize, Video } from "@grammyjs/types/message";

export class SingleMessageController {
  static readonly ChatIdEntityTypeMap = {
    photo: PHOTO_CHAT_ID,
    video: VIDEO_CHAT_ID,
    animation: VIDEO_CHAT_ID,
  } as const;

  static readonly idGetters = {
    photo: (photo: PhotoSize[]) => photo[0].file_id,
    video: (video: Video) => video.file_id,
    animation: (animation: Animation) => animation.file_id,
  } as const;

  public async processSingleMessage(ctx: Context, entityType: EntityType) {
    const { entity, messageId } = extractMessagePropertiesFromContext(ctx, entityType);
    await this.sendSingleMessage(ctx, entity, entityType);
    await this.deleteMessage(ctx, messageId);
  }

  private async deleteMessage(ctx: Context, messageId: number) {
    try {
      await ctx.api.deleteMessage(MY_ID, messageId);
    } catch (e) {
      await sendErrorLog(ctx, "Error while deleting message", e);
    }
  }

  private async sendSingleMessage(ctx: Context, entity: MediaEntity, entityType: EntityType) {
    const { api } = ctx;
    const chatId = SingleMessageController.ChatIdEntityTypeMap[entityType];
    const entityId = SingleMessageController.idGetters[entityType](entity);

    const uppercasedEntityType = entityType[0].toUpperCase() + entityType.slice(1);
    const sendAction = `send${uppercasedEntityType}` as SendMethodName<EntityType>;

    try {
      return api[sendAction](chatId, entityId);
    } catch (e) {
      await sendErrorLog(ctx, `Error while sending ${ entityType }`, e);
    }
  }
}