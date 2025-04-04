import { Context } from "grammy";
import { EntityType } from "./types";
import { MediaGroupController } from "./MediaGroupController";
import { extractMessagePropertiesFromContext } from "./utils";
import { SingleMessageController } from "./SingleMessageController";

export class MessagesController {
  public messagesCount: number = 0;
  private timer: NodeJS.Timeout | string | number | undefined = undefined;
  private mediaGroupController: MediaGroupController;
  private singleMessageController: SingleMessageController;

  constructor() {
    this.mediaGroupController = new MediaGroupController();
    this.singleMessageController = new SingleMessageController();
  }

  public async handleMessages(ctx: Context, entityType: EntityType) {
    this.messagesCount++;
    const { entity, messageId, mediaGroupId } = extractMessagePropertiesFromContext(ctx, entityType)

    if (!mediaGroupId) {
      await this.singleMessageController.processSingleMessage(ctx, entityType);
      this.reset();
      return;
    }

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.mediaGroupController.appendEntityIdToGroup(entity, entityType);
    this.mediaGroupController.appendMessageIdToGroup(messageId);

    this.timer = setTimeout(async () => {
      await this.mediaGroupController.processMediaGroup(ctx);
      this.reset();
    }, 1000);
  }

  reset() {
    this.messagesCount = 0;
    this.mediaGroupController.resetGroupIds();
  }
}