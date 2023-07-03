import { Request, Response } from "express";
import { CustomError } from "models/errror";
import { roomCollection } from "models/mongo";
import { ObjectId } from "mongodb";
import { Cookies } from "types/jwt";
import {
  RoomAccess,
  RoomChatResponse,
  RoomInit,
  RoomMongo,
  RoomOmit,
  RoomUser,
} from "types/mongo/roomDB";
import { secretToken } from "utils/constants/jwtConstants";
import { nowISO } from "utils/date";
import { parseIArray } from "utils/interface";
import { validJWT, verifyJWT } from "utils/jwtUtils";

export abstract class RoomController {
  static async getRooms(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    const match: { $match: { access: RoomAccess; relationships?: any } } = {
      $match: { access: "public" },
    };

    if (cookies?.jwt) {
      validJWT(cookies);
      const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);
      match.$match.relationships = {
        $not: { $elemMatch: { id: userId } },
      };
    }

    const data = await roomCollection
      .aggregate([
        {
          $facet: {
            data: [match, { $project: { _id: 1, title: 1, access: 1 } }],
            total: [{ $count: "total" }],
          },
        },
        {
          $project: {
            data: 1,
            total: {
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
        throw new CustomError("Cannot get rooms", 500);
      });

    res.status(200).json(data);
  }

  static async getRoom(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const { id } = req.params;
    const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);

    const data = await roomCollection
      .findOne<RoomMongo>({ _id: new ObjectId(id) })
      .catch(() => {
        throw new CustomError("Cannot get room", 500);
      });

    const chats: RoomChatResponse[] | undefined = data?.chats.map(
      ({ id, content, createdAt }) => ({
        id,
        message: content,
        received: !(userId == id),
        createdAt,
      })
    );

    res.status(200).json({ ...data, chats });
  }

  static async getRoomsUser(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);

    const projection = parseIArray<RoomUser>(["_id", "title"]);

    const data = await roomCollection
      .find(
        { relationships: { $elemMatch: { id: userId, type: "user" } } },
        { projection }
      )
      .toArray()
      .catch(() => {
        throw new CustomError("Cannot get rooms user", 500);
      });

    res.status(200).json(data);
  }

  static async postRoom(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const data: RoomInit = req.body.data;
    if (!data || !data.title) throw new CustomError("Invalid room", 500);

    const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);

    const now = nowISO();
    const room: RoomOmit = {
      title: data.title,
      access: data.access,
      chats: [],
      createdAt: now,
      updatedAt: now,
      relationships: [
        {
          id: userId,
          type: "user",
          role: "host",
          createdAt: now,
        },
      ],
    };

    await roomCollection
      .insertOne(room)
      .then(() => {
        res.status(200).send("Add room");
      })
      .catch(() => {
        throw new CustomError("Fail to add room", 500);
      });
  }

  static async postRoomValid(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const { id } = req.params;
    const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);
    console.log(userId);

    const data = await roomCollection.findOne(
      {
        _id: new ObjectId(id),
        relationships: { $elemMatch: { id: userId, type: "user" } },
      },
      { projection: { _id: 1 } }
    );

    console.log(data);

    if (data) res.status(200).send("Valid room");
    else new CustomError("Fail to valid room chat", 500);
  }

  static async putRoomChat(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const { id } = req.params;
    const { content } = req.body as { content: string };
    const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);

    const now = nowISO();

    await roomCollection
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: { updatedAt: now },
          $push: {
            chats: {
              id: userId,
              content,
              createdAt: now,
            },
          },
        }
      )
      .then(() => {
        res.status(200).send("Put room chat");
      })
      .catch(() => {
        throw new CustomError("Fail to put room chat", 500);
      });
  }

  static async putRoomUserJoin(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const { id } = req.params;
    const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);

    const now = nowISO();

    await roomCollection
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: { updatedAt: now },
          $push: {
            relationships: {
              id: userId,
              type: "user",
              role: "guest",
              createdAt: now,
            },
          },
        }
      )
      .then(() => {
        res.status(200).send("Put room user");
      })
      .catch(() => {
        throw new CustomError("Fail to put room user", 500);
      });
  }

  static async putRoomUserLeave(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const { id } = req.params;
    const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);

    const now = nowISO();

    await roomCollection
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: { updatedAt: now },
          $pull: { relationships: { id: userId, type: "user", role: "guest" } },
        }
      )
      .then(() => {
        res.status(200).send("Put room user");
      })
      .catch(() => {
        throw new CustomError("Fail to put room user", 500);
      });
  }

  static async deleteRoom(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const { id } = req.params;
    const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);

    await roomCollection
      .deleteOne({
        _id: new ObjectId(id),
        relationships: {
          $elemMatch: { id: userId, type: "user", role: "host" },
        },
      })
      .then(() => {
        res.status(200).send("Delete room");
      })
      .catch(() => {
        throw new CustomError("Fail to delete room", 500);
      });
  }
}
