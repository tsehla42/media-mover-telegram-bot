import { PhotoSize, Video } from "@grammyjs/types/message";

export type EntityType = "photo" | "video" | "animation";
export type MediaGroupEntityType = "photo" | "video";

export type MediaEntity = PhotoSize[] & Video

export type SendMethodName<T extends EntityType> =
  T extends "photo" ? "sendPhoto" :
    T extends "video" ? "sendVideo" :
      T extends "animation" ? "sendAnimation" : never;