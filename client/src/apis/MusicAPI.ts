import SpotifyWebApi from "spotify-web-api-node";
import { SpotifySearchQuery } from "~/types/spotify/search";
import { SpotifyInit } from "~/types/spotify/spotify";
import { envs } from "~/utils/Enviroments";
import { httpClient } from "~/utils/HttpClient";

export const spotifyApi = new SpotifyWebApi({
  clientId: envs.VITE_SPOTIFY_CLIENT_ID,
});

export const authMusicUrl = `https://accounts.spotify.com/authorize?client_id=${envs.VITE_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${envs.VITE_SPOTIFY_REDIRECT_URI}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

abstract class MusicAPI {
  static auth(data: string) {
    return httpClient.post<SpotifyInit>("api/spotify/auth", { code: data });
  }

  static refresh(data: string) {
    return httpClient.post("api/spotify/refresh", { refreshToken: data });
  }

  static async search(data: SpotifySearchQuery) {
    const { q, type, include_external, ...rest } = data;
    return spotifyApi.searchTracks(data.q, rest);
  }
}

export default MusicAPI;
