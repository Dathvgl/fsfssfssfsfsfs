import { SpotifyAlbumObject } from "./album";
import { SpotifyArtistObject, SpotifyArtistResponse } from "./artist";
import {
  SpotifyBaseObject,
  SpotifyExternalIdObject,
  SpotifyExternalUrlsObject,
  SpotifyRestrictionsObject,
} from "./spotify";

export type SpotifyTrackObject = SpotifyBaseObject & {
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: SpotifyExternalUrlsObject;
  is_playable: boolean;
  linked_from: Omit<SpotifyBaseObject, "name"> & {
    external_urls: SpotifyExternalUrlsObject;
    type: "track";
  };
  restrictions: SpotifyRestrictionsObject;
  preview_url: string;
  track_number: number;
  type: "track";
  is_local: boolean;
};

export type SpotifyTrackResponse = SpotifyTrackObject & {
  album: SpotifyAlbumObject & {
    artists: SpotifyArtistObject[];
    album_group: "album" | "single" | "compilation" | "appears_on";
  };
  artists: SpotifyArtistResponse[];
  external_ids: SpotifyExternalIdObject;
  popularity: number;
};

export type SpotifyTrackItem = SpotifyTrackObject & SpotifyArtistObject;
