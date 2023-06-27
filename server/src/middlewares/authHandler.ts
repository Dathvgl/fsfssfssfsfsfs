import asyncHandler from "express-async-handler";
import { envs } from "index";
import jwt from "jsonwebtoken";

export const authProtect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).send("Invalid credentials");
  } else {
    const token = authHeader.replace("Bearer ", "");

    jwt.verify(
      token,
      envs.ACCESS_TOKEN_SECRET ?? "jwtAccess",
      (error, decoded) => {
        if (error || !decoded) {
          res.status(401).send("Token expired");
        } else next();
      }
    );
  }
});
