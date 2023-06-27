import { Router } from "express";
import { TodoController } from "./todoController";
import tryCatch from "utils/tryCatch";

const todoRoute = Router();

todoRoute.get(
  "/getTodoRelationships",
  tryCatch(TodoController.getTodoRelationships)
);
todoRoute.get("/getTodos", tryCatch(TodoController.getTodos));
todoRoute.post("/postTodo", tryCatch(TodoController.postTodo));
todoRoute.put("/putTodo/:id", tryCatch(TodoController.putTodo));
todoRoute.delete("/deleteTodo/:id", tryCatch(TodoController.deleteTodo));

export default todoRoute;
