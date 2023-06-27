import { JwtPayload } from "jsonwebtoken";

export type Cookies =
  | undefined
  | {
      jwt: string;
    };

export type JwtPayloadExtra = JwtPayload & {
  userId: string;
};
