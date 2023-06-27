import { TodoInfo, TodoRelationship, TodoResponse } from "~/types/mongo/todoDB";
import { httpClientPrivate } from "~/utils/HttpClient";

abstract class TodoAPI {
  static getTodoRelationships() {
    return httpClientPrivate.get<TodoRelationship[]>(
      "api/todo/getTodoRelationships"
    );
  }

  static getTodos() {
    return httpClientPrivate.get<TodoResponse>("api/todo/getTodos");
  }

  static postTodo(data: TodoInfo) {
    return httpClientPrivate.post("api/todo/postTodo", { data });
  }

  static putTodo(id: string, data: TodoInfo) {
    return httpClientPrivate.put(`api/todo/putTodo/${id}`, { data });
  }

  static deleteTodo(id: string, length: number) {
    return httpClientPrivate.delete(`api/todo/deleteTodo/${id}`, {
      data: { length },
    });
  }
}

export default TodoAPI;
