import { Request } from "express";

export type ProjectionMongo = { [key: string]: number };

export type BaseMongo = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  relationships: RelationshipMongo[];
};

export type BaseResponse = {
  total: number;
};

export type RelationshipType = "user" | "cover" | "todo" | "mangaFollow";

export type RelationshipMongo = {
  id: string;
  type: RelationshipType;
};
