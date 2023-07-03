import { Request, Response } from "express";
import { CustomError } from "models/errror";
import { coverCollection } from "models/mongo";
import { ObjectId } from "mongodb";
import { CoverInfo, CoverOmit, CoverUpdate } from "types/mongo/cover";
import { nowISO } from "utils/date";
import { parseIProjection } from "utils/interface";

export abstract class CoverController {
  static async getCover(req: Request, res: Response) {
    const { id } = req.params;

    const projection = parseIProjection<CoverInfo>([
      "base64",
      "createdAt",
      "updatedAt",
    ]);

    await coverCollection
      .findOne({ _id: new ObjectId(id) }, { projection })
      .then((data) => res.status(200).json(data))
      .catch(() => {
        throw new CustomError("Cannot get cover", 500);
      });
  }

  static async postCover() {
    const now = nowISO();
    const cover: CoverOmit = {
      createdAt: now,
      updatedAt: now,
      relationships: [],
    };

    const coverId = await coverCollection
      .insertOne(cover)
      .then(async (result) => result.insertedId.toString())
      .catch(() => {
        throw new CustomError("Fail to add cover", 500);
      });

    return coverId;
  }

  static async putCover(cover: CoverUpdate) {
    const { id, ...rest } = cover;

    await coverCollection
      .updateOne({ _id: new ObjectId(id) }, { $set: { ...rest } })
      .catch(() => {
        throw new CustomError("Fail to put cover", 500);
      });
  }
}
