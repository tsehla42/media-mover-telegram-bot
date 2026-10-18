import { describe, expect, it, vi } from "vitest";
import { Context } from "grammy";
import { TextMessageController } from "./TextMessageController";
import { MY_ID } from "../config";

const makeCtx = (text: string | undefined, deleteMessage = vi.fn().mockResolvedValue(true)) => {
  const ctx = {
    message: text === undefined ? undefined : { message_id: 42, text },
    api: { deleteMessage, sendMessage: vi.fn().mockResolvedValue({}) },
  };
  return { ctx: ctx as unknown as Context, deleteMessage };
};

describe("TextMessageController", () => {
  const controller = new TextMessageController();

  it("deletes a plain text message", async () => {
    const { ctx, deleteMessage } = makeCtx("up");

    await controller.handleTextMessage(ctx);

    expect(deleteMessage).toHaveBeenCalledTimes(1);
    expect(deleteMessage).toHaveBeenCalledWith(MY_ID, 42);
  });

  it("keeps command messages", async () => {
    const { ctx, deleteMessage } = makeCtx("/my_id");

    await controller.handleTextMessage(ctx);

    expect(deleteMessage).not.toHaveBeenCalled();
  });

  it("does nothing when there is no message or text", async () => {
    const { ctx, deleteMessage } = makeCtx(undefined);

    await controller.handleTextMessage(ctx);

    expect(deleteMessage).not.toHaveBeenCalled();
  });

  it("logs instead of throwing when deletion fails", async () => {
    const deleteMessage = vi.fn().mockRejectedValue(new Error("no rights"));
    const { ctx } = makeCtx("down", deleteMessage);

    await expect(controller.handleTextMessage(ctx)).resolves.toBeUndefined();
    expect(ctx.api.sendMessage).toHaveBeenCalledTimes(1);
  });
});
