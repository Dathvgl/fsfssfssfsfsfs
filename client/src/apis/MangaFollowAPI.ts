import { MangaType } from "~/types/mangaLib";
import {
  MangaFollowFollow,
  MangaFollowInfo,
  MangaFollowResponse,
  MangaFollowUpdate,
} from "~/types/mongo/mangaFollowDB";
import { httpClientPrivate } from "~/utils/HttpClient";

abstract class MangaFollowAPI {
  static getFollows(type: MangaType, limit: number, offset: number) {
    return httpClientPrivate.get<MangaFollowResponse>(
      `api/mangaFollow/getFollows/${type}`,
      { params: { limit, offset } }
    );
  }

  static getFollow(type: MangaType, path: string) {
    return httpClientPrivate.get<MangaFollowFollow>(
      `api/mangaFollow/getFollow/${type}/${path}`
    );
  }

  static getFollowChapter(type: MangaType, path: string) {
    return httpClientPrivate.get<MangaFollowFollow>(
      `api/mangaFollow/getFollowChapter/${type}/${path}`
    );
  }

  static postFollow(data: MangaFollowInfo) {
    return httpClientPrivate.post("api/mangaFollow/postFollow", { data });
  }

  static putFollow(id: string, type: MangaType, data: MangaFollowUpdate) {
    return httpClientPrivate.put(`api/mangaFollow/putFollow/${id}/${type}`, {
      data,
    });
  }

  static deleteFollow(id: string, type: MangaType) {
    return httpClientPrivate.delete(
      `api/mangaFollow/deleteFollow/${id}/${type}`
    );
  }
}

export default MangaFollowAPI;
