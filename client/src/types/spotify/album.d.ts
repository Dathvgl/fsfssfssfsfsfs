import { SpotifyArtistResponse } from "./artist";
import {
    SpotifyBaseObject,
    SpotifyCopyrightObject,
    SpotifyExternalIdObject,
    SpotifyExternalUrlsObject,
    SpotifyImageObject,
    SpotifyPaging,
    SpotifyRestrictionsObject,
} from "./spotify";
import { SpotifyTrackItem } from "./track";

export type SpotifyAlbumObject = SpotifyBaseObject & {
  album_type: "album" | "single" | "compilation";
  total_tracks: number;
  available_markets: string[];
  external_urls: SpotifyExternalUrlsObject;
  images: SpotifyImageObject[];
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  restrictions: SpotifyRestrictionsObject;
  type: "album";
  copyrights: SpotifyCopyrightObject[];
  external_ids: SpotifyExternalIdObject;
  genres: string[];
  label: string;
  popularity: number;
};

export type SpotifyAlbumResponse = SpotifyAlbumObject & {
  artists: SpotifyArtistResponse[];
  tracks: SpotifyPaging<SpotifyTrackItem>;
};
