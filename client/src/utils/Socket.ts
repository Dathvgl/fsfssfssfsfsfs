import { io } from "socket.io-client";
import { envs } from "./Enviroments";

export const socket = io(envs.NODE_SERVER ?? "http://localhost:8080", {
  autoConnect: false,
});
