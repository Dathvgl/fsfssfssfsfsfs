import {
  ZingMP3SongDetailResponse,
  ZingMP3SongResponse,
} from "~/types/zingMP3/song";
import { ZingMP3Home, ZingMP3Search } from "~/types/zingMP3/zingMP3";
import { httpClient } from "~/utils/HttpClient";

abstract class ZingMP3API {
  static song(id: string) {
    return httpClient.get<ZingMP3SongDetailResponse>(`api/zingMP3/song/${id}`);
  }

  static detailPlaylist(id: string) {
    return httpClient.get(`api/zingMP3/detailPlaylist/${id}`);
  }

  static home() {
    return httpClient.get<ZingMP3Home>("api/zingMP3/home");
  }

  static top100() {
    return httpClient.get("api/zingMP3/top100");
  }

  static chartHome() {
    return httpClient.get("api/zingMP3/chartHome");
  }

  static newReleaseChart() {
    return httpClient.get("api/zingMP3/newReleaseChart");
  }

  static infoSong(id: string) {
    return httpClient.get<ZingMP3SongResponse>(`api/zingMP3/infoSong/${id}`);
  }

  static artist(id: string) {
    return httpClient.get(`api/zingMP3/artist/${id}`);
  }

  static listArtistSong(id: string) {
    return httpClient.get(`api/zingMP3/listArtistSong/${id}`);
  }

  static lyris(id: string) {
    return httpClient.get(`api/zingMP3/lyris/${id}`);
  }

  static search(name: string) {
    return httpClient.get<ZingMP3Search>(`api/zingMP3/search/${name}`);
  }

  static listMv(id: string) {
    return httpClient.get(`api/zingMP3/listMv/${id}`);
  }

  static categoryMv(id: string) {
    return httpClient.get(`api/zingMP3/categoryMv/${id}`);
  }

  static video(id: string) {
    return httpClient.get(`api/zingMP3/video/${id}`);
  }
}

export default ZingMP3API;
