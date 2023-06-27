import {
  Genre,
  MangaType,
  ResponseChapter,
  ResponseDetailManga,
  ResponseListManga,
} from "~/types/mangaLib";
import { httpClient } from "~/utils/HttpClient";

abstract class MangaLibAPI {
  static async genres(type: MangaType) {
    return httpClient.get<Genre[]>("api/mangaLib/genres", { params: { type } });
  }

  static async lastest(type: MangaType, page?: number) {
    return httpClient.get<ResponseListManga>("api/mangaLib/lastest", {
      params: { type, page },
    });
  }

  static async search(type: MangaType, title: string, page?: number) {
    return httpClient.get<ResponseListManga>("api/mangaLib/search", {
      params: { type, title, page },
    });
  }

  static async genreList(type: MangaType, genre: Genre, page?: number) {
    return httpClient.get<ResponseListManga>("api/mangaLib/genreList", {
      params: { type, genre, page },
    });
  }

  static async manga(type: MangaType, url: string) {
    return httpClient.get<ResponseDetailManga>("api/mangaLib/manga", {
      params: { type, url },
    });
  }

  static async chapter(
    type: MangaType,
    urlChapter: string,
    url?: string,
    path?: string
  ) {
    return httpClient.get<ResponseChapter>("api/mangaLib/chapter", {
      params: { type, urlChapter, url, path },
    });
  }
}

export default MangaLibAPI;
