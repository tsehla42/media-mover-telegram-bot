import { Context } from "grammy";
import { EntityType, MediaEntity } from "./types";
import { MY_ID, PHOTO_CHAT_ID, VIDEO_CHAT_ID } from "./config";
import { extractMessagePropertiesFromContext, sendErrorLog } from "./utils";
import { PhotoSize, Video } from "@grammyjs/types/message";
import { Throttler } from "./Throttler";

export class SingleMessageController {
  static readonly ChatIdEntityTypeMap = {
    photo: PHOTO_CHAT_ID,
    video: VIDEO_CHAT_ID,
  } as const;
  static readonly idGetters = {
    photo: (photo: PhotoSize[]) => photo[0].file_id,
    video: (video: Video) => video.file_id,
  } as const;

  private readonly throttler = new Throttler(2000);

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
    const isPhoto = entityType === "photo";
    const isVideo = entityType === "video";
    try {
      await this.throttler.throttle();
      return isPhoto ? api.sendPhoto(chatId, entityId) : isVideo ? api.sendVideo(chatId, entityId) : undefined;
    } catch (e) {
      await sendErrorLog(ctx, `Error while sending ${ entityType }`, e);
    }
  }
}