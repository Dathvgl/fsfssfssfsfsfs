import {
  RoomInit,
  RoomResponse,
  RoomsResponse,
  RoomUser,
} from "~/types/mongo/roomDB";
import { httpClient, httpClientPrivate } from "~/utils/HttpClient";

abstract class RoomAPI {
  static getRooms() {
    return httpClient.get<RoomsResponse>("api/room/getRooms", {
      withCredentials: true,
    });
  }

  static getRoom(id: string) {
    return httpClientPrivate.get<RoomResponse>(`api/room/getRoom/${id}`);
  }

  static getRoomsUser() {
    return httpClientPrivate.get<RoomUser[]>("api/room/getRoomsUser");
  }

  static postRoom(data: RoomInit) {
    return httpClientPrivate.post("api/room/postRoom", { data });
  }

  static postRoomValid(id: string) {
    return httpClientPrivate.post(`api/room/postRoomValid/${id}`);
  }

  static putRoomChat(id: string, content: string) {
    return httpClientPrivate.put(`api/room/putRoomChat/${id}`, { content });
  }

  static putRoomUserJoin(id: string) {
    return httpClientPrivate.put(`api/room/putRoomUserJoin/${id}`);
  }

  static putRoomUserLeave(id: string) {
    return httpClientPrivate.put(`api/room/putRoomUserLeave/${id}`);
  }

  static deleteRoom(id: string) {
    return httpClientPrivate.delete(`api/room/deleteRoom/${id}`);
  }
}

export default RoomAPI;
