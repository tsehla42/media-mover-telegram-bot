import { config as loadEnv } from "dotenv";
import env from "env-var";

if (process.env.NODE_ENV !== "production") {
  loadEnv();
}

export const API_KEY = env.get("API_KEY").required().asString();
export const MY_ID = env.get("MY_ID").required().asIntPositive();
export const PHOTO_CHAT_ID = env.get("PHOTO_CHAT_ID").required().asIntNegative();
export const VIDEO_CHAT_ID = env.get("VIDEO_CHAT_ID").required().asIntNegative();
