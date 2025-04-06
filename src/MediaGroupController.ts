import { Context } from "grammy";
import { InputMediaPhoto, InputMediaVideo } from "grammy/out/types.node";
import { MY_ID, PHOTO_CHAT_ID, VIDEO_CHAT_ID } from "./config";
import { EntityType, MediaEntity } from "./types";
import { PhotoSize, Video } from "@grammyjs/types/message";
import { sendErrorLog, sendTextMessage } from "./utils";

export class MediaGroupController {
  private messagesIds: number[] = [];
  private photoGroupIds: string[] = [];
  private videoGroupIds: string[] = [];
  private mediaGroupId: string | undefined = undefined;
  protected ctx: Context | undefined = undefined;

  public resetGroupIds() {
    this.messagesIds = [];
    this.photoGroupIds = [];
    this.videoGroupIds = [];
  }

  public async processMediaGroup(ctx: Context) {
    await this.sendMediaGroup(ctx);
    await this.deleteMessages(ctx);
  }

  public async deleteMessages(ctx: Context) {
    try {
      if (this.messagesIds.length) {
        await ctx.api.deleteMessages(MY_ID, this.messagesIds);
      }
    } catch (e) {
      await sendErrorLog(ctx, "Error while deleting messages", e);
      this.resetGroupIds();
    }
  }

  public async sendMediaGroup(ctx: Context) {
    const inputMediaPhotos = this.createMediaGroupFromIds(this.photoGroupIds, "photo") as InputMediaPhoto[];
    const inputMediaVideos = this.createMediaGroupFromIds(this.videoGroupIds, "video") as InputMediaVideo[];
    try {
      if (!!this.photoGroupIds.length) {
        await ctx.api.sendMediaGroup(PHOTO_CHAT_ID, inputMediaPhotos);
      }
      if (!!this.videoGroupIds.length) {
        await ctx.api.sendMediaGroup(VIDEO_CHAT_ID, inputMediaVideos);
      }
    } catch (e) {
      await sendErrorLog(ctx, `Error while sending media group`, e);
      this.resetGroupIds();
    }
  }

  private createMediaGroupFromIds(groupIds: string[], entityType: EntityType) {
    const mediaGroup = [];
    for (let i = 0; i < groupIds.length && i < 10; i++) {
      mediaGroup.push({
        type: entityType,
        media: groupIds[i]
      });
    }
    return mediaGroup;
  }

  public appendEntityIdToGroup(entity: MediaEntity, entityType: EntityType) {
    this[`${ entityType }IdSetter`](entity, entityType);
  }

  private photoIdSetter(photo: PhotoSize[], entityType: EntityType) {
    this.appendFileId(photo[0].file_id, entityType);
  }

  private videoIdSetter(video: Video, entityType: EntityType) {
    this.appendFileId(video.file_id, entityType);
  }

  private appendFileId(fileId: string, entityType: EntityType) {
    this[`${ entityType }GroupIds`].push(fileId);
  }

  public appendMessageIdToGroup(messageId: number) {
    this.messagesIds.push(messageId);
  }
}