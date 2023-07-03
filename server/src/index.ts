import { config } from "dotenv";
config();

export const envs = process.env;

import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import { createServer } from "http";
import errorHandler from "middlewares/errorHandler";
import ApiRoute from "routes/api";
import { Server } from "socket.io";

process.setMaxListeners(0);

const app: Application = express();
const port: number = Number(process.env.PORT) || 8080;

const originCors = (envs.ORIGIN_CORS ?? "http://localhost:3000")
  .split(",")
  .map((item) => item.trim());

app.use(cors({ origin: originCors, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use("/api", ApiRoute);

app.get("/", async (req, res) => {
  res.send("Hello from ts");
});

app.get("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const server = createServer(app);

const io = new Server(server, {
  cors: { origin: originCors },
});

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on("roomJoinClient", (id: string) => {
    socket.join(id);
    console.log(`User ${socket.id} join ${id}`);
  });

  socket.on("roomLeaveClient", (id: string) => {
    socket.leave(id);
    console.log(`User ${socket.id} leave ${id}`);
  });

  socket.on("sendMessageClient", (message: string) => {
    socket.broadcast.emit("sendMessageServer", message);
  });

  socket.on("typingMessageClient", (data: { id: string; typing: boolean }) => {
    socket.broadcast.to(data.id).emit("typingMessageServer", data.typing);
  });
});

server.listen(port, () => {
  console.log(`Server: http://localhost:${port}/`);
});

app.use(errorHandler);
