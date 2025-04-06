import * as dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.API_KEY;
const MY_ID = Number(process.env.MY_ID);
const PHOTO_CHAT_ID = Number(process.env.PHOTO_CHAT_ID);
const VIDEO_CHAT_ID = Number(process.env.VIDEO_CHAT_ID);

if (!API_KEY) {
  throw new Error("Missing API_KEY in environment variables");
}

export {
  API_KEY,
  MY_ID,
  PHOTO_CHAT_ID,
  VIDEO_CHAT_ID,
}