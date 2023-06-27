import { Request } from "express";

export type ProjectionMongo = { [key: string]: number };

export type BaseMongo = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  relationships: RelationshipMongo[];
};

export type BaseResponse = {
  total: { total: number }[];
};

type RelationshipType = "user" | "todo" | "mangaFollow";

type RelationshipMongo = {
  id: string;
  type: RelationshipType;
};
