import { delay } from "./utils";

export class Throttler {
  private last = 0;
  private readonly wait: number;

  constructor(waitMs: number) {
    this.wait = waitMs;
  }

  async throttle(): Promise<void> {
    const now = Date.now();
    const delta = now - this.last;

    if (delta < this.wait) {
      await delay(this.wait - delta);
    }
    this.last = Date.now();
  }
}