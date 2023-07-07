import {
  SpotifyBaseObject,
  SpotifyExternalUrlsObject,
  SpotifyFollowerObject,
  SpotifyImageObject,
} from "./spotify";

export type SpotifyArtistObject = SpotifyBaseObject & {
  external_urls: SpotifyExternalUrlsObject;
  type: "artist";
};

export type SpotifyArtistResponse = SpotifyArtistObject & {
  followers: SpotifyFollowerObject;
  genres: string[];
  images: SpotifyImageObject[];
  popularity: number;
};
