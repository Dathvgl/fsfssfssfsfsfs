import { BaseMongo } from "./mongoDB";

export type CoverMongo = BaseMongo & {
  base64?: string;
};

export type CoverOmit = Omit<CoverMongo, "_id">;
export type CoverInfo = Omit<BaseMongo, "_id" | "relationships"> & {
  base64: string;
};

export type CoverUpdate = {
  id: string;
  base64: string;
};
