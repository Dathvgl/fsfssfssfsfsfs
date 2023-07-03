import { Router } from "express";
import { authProtect } from "middlewares/authHandler";
import tryCatch from "utils/tryCatch";
import { RoomController } from "./roomController";

const roomRoute = Router();

roomRoute.get("/getRooms", tryCatch(RoomController.getRooms));
roomRoute.get("/getRoom/:id", tryCatch(RoomController.getRoom));
roomRoute.get(
  "/getRoomsUser",
  authProtect,
  tryCatch(RoomController.getRoomsUser)
);
roomRoute.post("/postRoom", authProtect, tryCatch(RoomController.postRoom));
roomRoute.post(
  "/postRoomValid/:id",
  authProtect,
  tryCatch(RoomController.postRoomValid)
);
roomRoute.put(
  "/putRoomChat/:id",
  authProtect,
  tryCatch(RoomController.putRoomChat)
);
roomRoute.put(
  "/putRoomUserJoin/:id",
  authProtect,
  tryCatch(RoomController.putRoomUserJoin)
);
roomRoute.put(
  "/putRoomUserLeave/:id",
  authProtect,
  tryCatch(RoomController.putRoomUserLeave)
);
roomRoute.put(
  "/deleteRoom/:id",
  authProtect,
  tryCatch(RoomController.deleteRoom)
);

export default roomRoute;
