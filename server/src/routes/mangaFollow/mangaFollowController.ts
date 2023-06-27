import { Request, Response } from "express";
import { CustomError } from "models/errror";
import { mangaFollowCollection } from "models/mongo";
import { ObjectId } from "mongodb";
import { Cookies } from "types/jwt";
import { MangaType } from "types/mangaLib";
import {
  MangaFollowFollow,
  MangaFollowInfo,
  MangaFollowOmit,
  MangaFollowUpdate,
} from "types/mongo/mangaFollowDB";
import { secretToken } from "utils/constants/jwtConstants";
import { nowISO } from "utils/date";
import { parseIProjection } from "utils/interface";
import { validJWT, verifyJWT } from "utils/jwtUtils";

export abstract class MangaFollowController {
  static async getFollows(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const { type } = req.params;
    const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);

    const data = await mangaFollowCollection
      .aggregate([
        {
          $facet: {
            data: [
              {
                $match: {
                  type: type,
                  relationships: { $elemMatch: { id: userId } },
                },
              },
            ],
            total: [
              {
                $match: {
                  relationships: { $elemMatch: { id: userId } },
                },
              },
              { $count: "total" },
            ],
          },
        },
        {
          $project: {
            data: 1,
            count: {
              $let: {
                vars: { prop: { $first: "$total" } },
                in: "$$prop.total",
              },
            },
          },
        },
      ])
      .next()
      .catch(() => {
        throw new CustomError("Cannot get folow mangas", 500);
      });

    res.status(200).json(data);
  }

  static async getFollow(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const { type, path } = req.params;
    const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);

    const projection = parseIProjection<MangaFollowFollow>([
      "_id",
      "currentRead",
      "currentReadUrl",
      "lastestRead",
      "lastestReadUrl",
    ]);

    const data = await mangaFollowCollection
      .findOne(
        {
          url: path,
          type: type as MangaType,
          relationships: { $elemMatch: { id: userId, type: "user" } },
        },
        { projection }
      )
      .catch(() => {
        throw new CustomError("Fail to get follow manga", 500);
      });

    res.status(200).json(data);
  }

  static async getFollowChapter(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const { type, path } = req.params;
    const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);

    const projection = parseIProjection<MangaFollowFollow>([
      "_id",
      "currentRead",
      "currentReadUrl",
      "lastestRead",
      "lastestReadUrl",
    ]);

    const data = await mangaFollowCollection
      .findOne(
        {
          url: { $regex: `.*${path}.*` },
          type: type as MangaType,
          relationships: { $elemMatch: { id: userId, type: "user" } },
        },
        { projection }
      )
      .catch(() => {
        throw new CustomError("Fail to get follow manga", 500);
      });

    res.status(200).json(data);
  }

  static async postFollow(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const data: MangaFollowInfo = req.body.data;
    const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);

    const now = nowISO();
    const follow: MangaFollowOmit = {
      ...data,
      createdAt: now,
      updatedAt: now,
      relationships: [{ id: userId, type: "user" }],
    };

    await mangaFollowCollection
      .insertOne(follow)
      .then(() => {
        res.status(200).send("Follow manga");
      })
      .catch(() => {
        throw new CustomError("Fail to follow manga", 500);
      });
  }

  static async putFollow(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const { id, type } = req.params;
    const data: MangaFollowUpdate = req.body.data;
    const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);

    await mangaFollowCollection
      .updateOne(
        {
          _id: new ObjectId(id),
          type: type as MangaType,
          relationships: { $elemMatch: { id: userId, type: "user" } },
        },
        { $set: { ...data } }
      )
      .then(() => {
        res.status(200).send("Follow manga");
      })
      .catch(() => {
        throw new CustomError("Fail to follow manga", 500);
      });
  }

  static async deleteFollow(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const { id, type } = req.params;
    const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);

    await mangaFollowCollection
      .deleteOne({
        _id: new ObjectId(id),
        type: type as MangaType,
        relationships: { $elemMatch: { id: userId, type: "user" } },
      })
      .then(() => {
        res.status(200).send("Unfollow manga");
      })
      .catch(() => {
        throw new CustomError("Fail to unfollow manga", 500);
      });
  }
}
