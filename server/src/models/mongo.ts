import { config } from "dotenv";
import { envs } from "index";
import { MongoClient } from "mongodb";
import { CoverOmit } from "types/mongo/cover";
import { MangaFollowOmit } from "types/mongo/mangaFollowDB";
import { RoomOmit } from "types/mongo/roomDB";
import { TodoOmit } from "types/mongo/todoDB";
import { UserOmit } from "types/mongo/userDB";

config();

const mongoClient = new MongoClient(envs.MONGO_URL ?? "");
mongoClient.connect().then(() => console.log("MongoDB connect"));
const mongoDB = mongoClient.db(envs.MONGO_DB);

export const userCollection = mongoDB.collection<UserOmit>("user");
export const coverCollection = mongoDB.collection<CoverOmit>("cover");
export const todoCollection = mongoDB.collection<TodoOmit>("todo");
export const mangaFollowCollection =
  mongoDB.collection<MangaFollowOmit>("mangaFollow");
export const roomCollection = mongoDB.collection<RoomOmit>("room");
