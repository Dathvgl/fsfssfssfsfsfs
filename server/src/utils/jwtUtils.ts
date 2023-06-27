import jwt from "jsonwebtoken";
import { CustomError } from "models/errror";
import { Cookies, JwtPayloadExtra } from "types/jwt";

export function initJWT(
  userId: string,
  secret: jwt.Secret,
  expiresIn?: string | number
) {
  return jwt.sign({ userId }, secret, { expiresIn });
}

export function validJWT(cookies: Cookies) {
  if (!cookies?.jwt) throw new CustomError("You must login", 401);
}

export function verifyJWT(
  token: string,
  secret: jwt.Secret | jwt.GetPublicKeyOrSecret
) {
  const obj = { userId: "" };
  jwt.verify(token, secret, (error, decoded) => {
    if (error) throw new CustomError("Invalid token", 401);
    const { userId } = decoded as JwtPayloadExtra;
    obj.userId = userId;
  });
  return obj.userId;
}
