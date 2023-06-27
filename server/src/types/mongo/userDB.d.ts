import { BaseMongo } from "./mongoDB";

export type UserMongo = BaseMongo & {
  _id: string;
  username: string;
  email: string;
  password: string;
  refreshToken: string;
  loginAt: string;
  logoutAt: string;
};

export type UserOmit = Omit<UserMongo, "_id">;
export type UserToken = { token: string };
export type UserRegister = Pick<UserMongo, "username" | "email" | "password">;
export type UserLogin = Pick<UserMongo, "email" | "password">;
export type UserReset = Pick<UserMongo, "email">;
export type UserProfile = Omit<
  UserMongo,
  "email" | "password" | "refreshToken"
>;
