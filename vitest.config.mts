import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    env: {
      API_KEY: "test-api-key",
      MY_ID: "123456",
      PHOTO_CHAT_ID: "-100111",
      VIDEO_CHAT_ID: "-100222",
    },
  },
});
