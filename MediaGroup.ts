import { Api, Context } from "grammy";
import { PhotoSize, Video } from "@grammyjs/types/message";
import { P1_ID, P2_ID } from "./config";
import { InputMediaPhoto, InputMediaVideo } from "grammy/out/types.node";

type EntityType = "photo" | "video";
type MediaEntity = PhotoSize[] & Video

const ChatIdTypeMap = {
  photo: P1_ID,
  video: P2_ID,
} as const;

export class MediaGroup {
  public messagesCount: number = 0;
  private timer: NodeJS.Timeout | string | number | undefined = undefined;
  private photoGroupIds: string[] = [];
  private videoGroupIds: string[] = [];
  private mediaGroupId: string | undefined = undefined;
  private mediaGroupChanged: boolean = false;

  constructor() {
    this.resetCount();
  }

  appendFileId(fileId: string, entityType: EntityType) {
    this[`${ entityType }GroupIds`].push(fileId);
  }

  resetCount() {
    this.messagesCount = 0;
    this.videoGroupIds = [];
    this.photoGroupIds = [];
  }

  public async handleMessages(ctx: Context, entityType: EntityType) {
    this.messagesCount++;
    const entity = ctx.message?.[entityType] as MediaEntity;
    this[`${ entityType }IdHandler`](entity, entityType);
    const mediaGroupId = ctx.message?.media_group_id;
    console.log(mediaGroupId);
    this.mediaGroupId = mediaGroupId;

    if (!this.mediaGroupId) {
      await this.sendSingleMessage(ctx.api, entity, entityType);
      return;
    }

    if (this.timer) {
      console.log("clear timeout")
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(async () => {
      console.log("Total messages received:", this.messagesCount);
      this.singleMediaGroupHandler(mediaGroupId)
      await this.sendMediaGroup(ctx);
      this.resetCount();
    }, 1000);
  }

  async sendSingleMessage(api: Api, entity: MediaEntity, entityType: EntityType) {
    const chatId = ChatIdTypeMap[entityType];
    const entityId = this[`${ entityType }IdGetter`](entity);
    return entityType === "photo" ? api.sendPhoto(chatId, entityId) : entityType === "video" ? api.sendVideo(chatId, entityId) : undefined;
  }

  async sendMediaGroup(ctx: Context) {
    const inputMediaPhoto = this.createMediaGroupFromIds(this.photoGroupIds, "photo") as InputMediaPhoto[];
    const inputMediaVideo = this.createMediaGroupFromIds(this.videoGroupIds, "video") as InputMediaVideo[];
    const photosCount = this.photoGroupIds.length;
    const videosCount = this.videoGroupIds.length;
    if (!!photosCount) {
      await ctx.api.sendMediaGroup(P1_ID, inputMediaPhoto);
    }
    if (!!videosCount) {
      await ctx.api.sendMediaGroup(P2_ID, inputMediaVideo);
    }
  }

  createMediaGroupFromIds(groupIds: string[], entityType: EntityType) {
    const mediaGroup = [];
    for (let i = 0; i < groupIds.length && i < 10; i++) {
      mediaGroup.push({
        type: entityType,
        media: groupIds[i]
      });
    }
    return mediaGroup;
  }

  private photoIdHandler(photo: PhotoSize[], entityType: EntityType) {
    this.appendFileId(photo[0].file_id, entityType);
  }

  private videoIdHandler(video: Video, entityType: EntityType) {
    this.appendFileId(video.file_id, entityType);
  }

  private photoIdGetter(photo: PhotoSize[]) {
    return photo[0].file_id;
  }

  private videoIdGetter(video: Video) {
    return video.file_id;
  }

  singleMediaGroupHandler(mediaGroupId: string | undefined) {
    if (!mediaGroupId) {
      return;
    }
    const isSame = this.mediaGroupId === mediaGroupId;
    this.mediaGroupChanged = !isSame;
  }
}