import {
  BaseMongo,
  BaseResponse,
  RelationshipMongo,
  RelationshipType,
} from "./mongoDB";

export type RoomAccess = "public" | "private";
export type RoomRole = "host" | "guest";

export type RoomRelationship = RelationshipMongo & {
  role: RoomRole;
  createdAt: string;
};

export type RoomChat = {
  id: string;
  content: string;
  createdAt: string;
};

export type RoomChatResponse = {
  id?: string;
  message: string;
  received: boolean;
  createdAt: string;
};

export type RoomMongo = BaseMongo & {
  title: string;
  access: RoomAccess;
  chats: RoomChat[];
  relationships: RoomRelationship[];
};

export type RoomOmit = Omit<RoomMongo, "_id">;
export type RoomUser = Pick<RoomMongo, "_id" | "title">;
export type RoomInit = Pick<RoomMongo, "title" | "access">;

export type RoomInfo = {
  _id: string;
  title: string;
  access: RoomAccess;
  total: number;
};

export type RoomResponse = Omit<RoomMongo, "chats"> & {
  chats: RoomChatResponse[];
};

export type RoomsResponse = BaseResponse & {
  data: RoomInfo[];
};
