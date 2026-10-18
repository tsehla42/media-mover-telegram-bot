import { describe, expect, it, vi } from "vitest";
import { Context } from "grammy";
import { SingleMessageController } from "./SingleMessageController";
import { MY_ID, PHOTO_CHAT_ID } from "./config";

const makeCtx = () => {
  const api = {
    sendPhoto: vi.fn().mockResolvedValue({ message_id: 1 }),
    deleteMessage: vi.fn().mockResolvedValue(true),
    sendMessage: vi.fn().mockResolvedValue({}),
  };
  const ctx = {
    message: { message_id: 42, photo: [{ file_id: "photo-file-id" }] },
    api,
  };
  return { ctx: ctx as unknown as Context, api };
};

describe("SingleMessageController", () => {
  const controller = new SingleMessageController();

  it("deletes the original after a successful send", async () => {
    const { ctx, api } = makeCtx();

    await controller.processSingleMessage(ctx, "photo");

    expect(api.sendPhoto).toHaveBeenCalledWith(PHOTO_CHAT_ID, "photo-file-id");
    expect(api.deleteMessage).toHaveBeenCalledWith(MY_ID, 42);
  });

  it("keeps the original and logs when sending fails", async () => {
    const { ctx, api } = makeCtx();
    api.sendPhoto.mockRejectedValue(new Error("boom"));

    await expect(controller.processSingleMessage(ctx, "photo")).resolves.toBeUndefined();

    expect(api.sendMessage).toHaveBeenCalledTimes(1);
    expect(api.deleteMessage).not.toHaveBeenCalled();
  });
});
