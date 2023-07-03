import bycrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "models/errror";
import { userCollection } from "models/mongo";
import { ObjectId } from "mongodb";
import { CoverController } from "routes/cover/coverController";
import { Cookies, JwtPayloadExtra } from "types/jwt";
import {
  UserMongo,
  UserOmit,
  UserProfile,
  UserUpdate,
} from "types/mongo/userDB";
import {
  expireMiliToken,
  expireToken,
  secretToken,
} from "utils/constants/jwtConstants";
import { nowISO } from "utils/date";
import { parseIProjection } from "utils/interface";
import { initJWT, validJWT, verifyJWT } from "utils/jwtUtils";

type SecretType = "access" | "refresh";

const validUser = (user: unknown | null) => {
  if (!user) throw new CustomError("User not found", 403);
};

const cookieToken = (res: Response, token: string, type: SecretType) => {
  res.cookie("jwt", token, {
    secure: false,
    httpOnly: true,
    maxAge: expireMiliToken[type],
  });
};

const initBycrypt = async (str: string) => {
  const salt = await bycrypt.genSalt(10);
  return await bycrypt.hash(str, salt);
};

export abstract class UserController {
  static async userPerson(req: Request, res: Response) {
    const { id } = req.params;

    const data = await userCollection
      .aggregate([
        { $match: { $expr: { $eq: ["$_id", { $toObjectId: id }] } } },
        {
          $project: {
            username: 1,
            relationships: {
              $filter: {
                input: "$relationships",
                as: "array",
                cond: { $eq: ["$$array.type", "cover"] },
              },
            },
          },
        },
        { $unwind: { path: "$relationships" } },
        { $addFields: { coverId: { $toObjectId: "$relationships.id" } } },
        {
          $lookup: {
            from: "cover",
            localField: "coverId",
            foreignField: "_id",
            as: "result",
          },
        },
        { $unwind: { path: "$result" } },
        { $addFields: { base64: "$result.base64" } },
        {
          $project: {
            coverId: 0,
            result: 0,
            relationships: 0,
          },
        },
      ])
      .next()
      .catch(() => {
        throw new CustomError("Cannot get user", 500);
      });

    res.status(200).json(data);
  }

  static async register(req: Request, res: Response) {
    const { username, email, password } = req.body;

    const coverId = await CoverController.postCover();
    const newPassword = await initBycrypt(password);

    const now = nowISO();
    const newUser: UserOmit = {
      username,
      email,
      password: newPassword,
      refreshToken: "none",
      createdAt: now,
      updatedAt: now,
      loginAt: now,
      logoutAt: now,
      relationships: [
        {
          id: coverId,
          type: "cover",
        },
      ],
    };

    await userCollection
      .insertOne(newUser)
      .then(async (result) => {
        const userId = result.insertedId.toString();

        const accessToken = initJWT(
          userId,
          secretToken["access"],
          expireToken["access"]
        );

        const refreshToken = initJWT(
          userId,
          secretToken["refresh"],
          expireToken["refresh"]
        );

        await userCollection.updateOne(
          { _id: result.insertedId },
          { $set: { refreshToken } }
        );

        cookieToken(res, refreshToken, "refresh");
        res.status(200).json({ token: accessToken });
      })
      .catch(() => {
        throw new CustomError("Fail to register", 401);
      });
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomError("Wrong email or password", 401);
    }

    const user = await userCollection
      .findOne<UserMongo>({ email })
      .catch(() => {
        throw new CustomError("Fail to login", 401);
      });

    validUser(user);
    const match = await bycrypt.compare(password, user!.password);
    if (!match) throw new CustomError("Wrong password", 401);

    const userId = user!._id.toString();

    const accessToken = initJWT(
      userId,
      secretToken["access"],
      expireToken["access"]
    );

    const refreshToken = initJWT(
      userId,
      secretToken["refresh"],
      expireToken["refresh"]
    );

    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { refreshToken, loginAt: nowISO() } }
    );

    cookieToken(res, refreshToken, "refresh");
    res.status(200).json({ token: accessToken });
  }

  static async refresh(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const refreshToken: string = cookies!.jwt;
    const user = await userCollection.findOne<UserMongo>({ refreshToken });
    validUser(user);

    jwt.verify(refreshToken, secretToken["refresh"], (error, decoded) => {
      if (error) throw new CustomError("Invalid token", 401);
      const { userId } = decoded as JwtPayloadExtra;

      const accessToken = initJWT(
        userId,
        secretToken["access"],
        expireToken["access"]
      );

      res.status(200).json({ token: accessToken });
    });
  }

  static async logout(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const refreshToken: string = cookies!.jwt;
    await userCollection.updateOne(
      { refreshToken },
      { $set: { refreshToken: "none", logoutAt: nowISO() } }
    );

    res.clearCookie("jwt", {
      secure: false,
      httpOnly: true,
    });

    res.status(200).send("User logged out");
  }

  static async getProfile(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);

    const projection = parseIProjection<UserProfile>([
      "_id",
      "username",
      "createdAt",
      "relationships",
    ]);

    const user = await userCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection }
    );

    validUser(user);
    res.status(200).json(user);
  }

  static async putProfile(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);

    const updates = req.body as UserUpdate;
    if (!updates || Object.keys(updates).length == 0) {
      throw new CustomError("Cannot update profile", 500);
    }

    const { cover, ...rest } = updates;

    if (cover) await CoverController.putCover(cover);

    await userCollection
      .updateOne({ _id: new ObjectId(userId) }, { $set: { ...rest } })
      .then(() => res.status(200).send("Update profile success"))
      .catch(() => {
        throw new CustomError("Cannot update profile", 500);
      });
  }
}
