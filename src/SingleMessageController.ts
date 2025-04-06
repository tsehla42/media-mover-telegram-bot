import { Api, Context } from "grammy";
import { EntityType, MediaEntity } from "./types";
import { MY_ID, PHOTO_CHAT_ID, VIDEO_CHAT_ID } from "./config";
import { extractMessagePropertiesFromContext, sendErrorLog, sendTextMessage } from "./utils";
import { PhotoSize, Video } from "@grammyjs/types/message";

const ChatIdEntityTypeMap = {
  photo: PHOTO_CHAT_ID,
  video: VIDEO_CHAT_ID,
} as const;

export class SingleMessageController {
  public async processSingleMessage(ctx: Context, entityType: EntityType) {
    const { entity, messageId } = extractMessagePropertiesFromContext(ctx, entityType)
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
    const chatId = ChatIdEntityTypeMap[entityType];
    const entityId = this[`${ entityType }IdGetter`](entity);
    const isPhoto = entityType === "photo";
    const isVideo = entityType === "video";
    try {
      return isPhoto ? api.sendPhoto(chatId, entityId) : isVideo ? api.sendVideo(chatId, entityId) : undefined;
    } catch (e) {
      await sendErrorLog(ctx, `Error while sending ${entityType}`, e);
    }
  }

  private photoIdGetter(photo: PhotoSize[]) {
    return photo[0].file_id;
  }

  private videoIdGetter(video: Video) {
    return video.file_id;
  }
}