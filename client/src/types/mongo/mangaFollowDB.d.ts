import { MangaType } from "../mangaLib";
import { BaseMongo, BaseResponse } from "./mongoDB";

export type MangaFollowMongo = BaseMongo & {
  type: MangaType;
  url: string;
  title: string;
  cover: string;
  currentRead: number;
  currentReadUrl: string;
  lastestRead: number;
  lastestReadUrl: string;
};

export type MangaFollowOmit = Omit<MangaFollowMongo, "_id">;
export type MangaFollowInfo = Omit<
  MangaFollowMongo,
  "_id" | "createdAt" | "updatedAt" | "relationships"
>;

export type MangaFollowFollow = Omit<
  MangaFollowMongo,
  | "url"
  | "title"
  | "cover"
  | "type"
  | "createdAt"
  | "updatedAt"
  | "relationships"
>;

export type MangaFollowUpdate = {
  currentRead: number;
  currentReadUrl: string;
  lastestRead?: number;
  lastestReadUrl?: string;
};

export type MangaFollowResponse = BaseResponse & {
  data: MangaFollowMongo[];
};
