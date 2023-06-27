import { BaseMongo, BaseResponse, RelationshipMongo } from "./mongoDB";

export type TodoPriority = undefined | "low" | "medium" | "high" | "critical";
export type TodoProgress =
  | undefined
  | "constant"
  | "to do"
  | "in progress"
  | "done";

export type TodoMongo = BaseMongo & {
  content: string;
  todos: TodoMongo[];
  color?: string;
  priority?: TodoPriority;
  progress?: TodoProgress;
  weeks?: string[];
};

export type TodoOmit = Omit<TodoMongo, "_id">;
export type TodoInfo = Omit<
  TodoMongo,
  "_id" | "createdAt" | "updatedAt" | "relationships"
> & {
  relationship?: RelationshipMongo;
};

export type TodoScheme = Omit<TodoInfo, "relationship" | "weeks" | "todos">;

export type TodoRelationship = {
  _id: string;
  content: string;
  color?: string;
};

export type TodoResponse = BaseResponse & {
  data: TodoMongo[];
};
