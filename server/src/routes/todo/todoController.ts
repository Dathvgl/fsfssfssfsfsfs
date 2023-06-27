import { Request, Response } from "express";
import { CustomError } from "models/errror";
import { todoCollection } from "models/mongo";
import { ObjectId } from "mongodb";
import { Cookies } from "types/jwt";
import { TodoInfo, TodoOmit } from "types/mongo/todoDB";
import { secretToken } from "utils/constants/jwtConstants";
import { nowISO } from "utils/date";
import { validJWT, verifyJWT } from "utils/jwtUtils";

export abstract class TodoController {
  static async getTodoRelationships(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);

    const data = await todoCollection
      .aggregate([
        {
          $facet: {
            data: [
              {
                $match: {
                  relationships: {
                    $elemMatch: { id: userId },
                    $not: { $elemMatch: { type: "todo" } },
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  color: 1,
                  content: 1,
                },
              },
            ],
          },
        },
      ])
      .next()
      .catch(() => {
        throw new CustomError("Cannot get todo relationships", 500);
      });

    res.status(200).json(data?.data || []);
  }

  static async getTodos(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);

    const data = await todoCollection
      .aggregate([
        {
          $facet: {
            data: [
              {
                $match: {
                  relationships: {
                    $elemMatch: { id: userId },
                    $not: { $elemMatch: { type: "todo" } },
                  },
                },
              },
              { $addFields: { todoId: { $toString: "$_id" } } },
              {
                $lookup: {
                  from: "todo",
                  localField: "todoId",
                  foreignField: "relationships.id",
                  as: "todos",
                },
              },
              { $project: { todoId: 0 } },
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
        throw new CustomError("Cannot get todos", 500);
      });

    res.status(200).json(data);
  }

  static async postTodo(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const data: TodoInfo = req.body.data;
    if (!data || !data.content) throw new CustomError("Invalid todo", 500);

    const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);

    const { relationship, ...rest } = data;

    const now = nowISO();
    const todo: TodoOmit = {
      ...rest,
      createdAt: now,
      updatedAt: now,
      relationships: [{ id: userId, type: "user" }],
    };

    if (relationship) todo.relationships.push(relationship);

    await todoCollection
      .insertOne(todo)
      .then(() => {
        res.status(200).send("Add todo");
      })
      .catch(() => {
        throw new CustomError("Fail to add todo", 500);
      });
  }

  static async putTodo(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);

    const { id } = req.params;
    const { relationship, ...rest }: TodoInfo = req.body.data;

    if (!id) throw new CustomError("Invalid todo item", 500);

    const now = nowISO();
    await todoCollection
      .updateOne(
        {
          _id: new ObjectId(id),
          relationships: { $elemMatch: { id: userId, type: "user" } },
        },
        {
          $set: { ...rest, updatedAt: now },
          $pull: { relationships: { type: "todo" } },
        }
      )
      .then(async () => {
        await todoCollection
          .updateOne(
            {
              _id: new ObjectId(id),
              relationships: { $elemMatch: { id: userId, type: "user" } },
            },
            { $push: { relationships: relationship } }
          )
          .then(() => {
            res.status(200).send("Put todo");
          })
          .catch(() => {
            throw new CustomError("Fail to put todo", 500);
          });
      })
      .catch(() => {
        throw new CustomError("Fail to put todo", 500);
      });
  }

  static async deleteTodo(req: Request, res: Response) {
    const cookies: Cookies = req.cookies;
    validJWT(cookies);

    const userId = verifyJWT(cookies!.jwt, secretToken["refresh"]);

    const { id } = req.params;
    const length: number = req.body.length;

    if (!id) throw new CustomError("Invalid todo item", 500);

    if (length == 0) {
      await todoCollection
        .deleteOne({
          _id: new ObjectId(id),
          relationships: { $elemMatch: { id: userId, type: "user" } },
        })
        .then(() => {
          res.status(200).send("Delete todo");
        })
        .catch(() => {
          throw new CustomError("Fail to delete todo", 500);
        });
    } else {
      await todoCollection
        .deleteMany({
          relationships: { $elemMatch: { id: userId, type: "todo" } },
        })
        .then(async () => {
          await todoCollection
            .deleteOne({
              _id: new ObjectId(id),
              relationships: { $elemMatch: { id: userId, type: "user" } },
            })
            .then(() => {
              res.status(200).send("Delete todo");
            })
            .catch(() => {
              throw new CustomError("Fail to delete todo", 500);
            });
        })
        .catch(() => {
          throw new CustomError("Fail to delete todo", 500);
        });
    }
  }
}
