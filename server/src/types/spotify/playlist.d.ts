import {
  SpotifyBaseObject,
  SpotifyExternalUrlsObject,
  SpotifyFollowerObject,
  SpotifyImageObject,
} from "./spotify";

export type SpotifyPlaylistObject = SpotifyBaseObject & {
  collaborative: boolean;
  description: string;
  external_urls: SpotifyExternalUrlsObject;
  images: SpotifyImageObject[];
  owner: Omit<SpotifyBaseObject, "name"> & {
    external_urls: SpotifyExternalUrlsObject;
    followers: SpotifyFollowerObject;
    type: "user";
    display_name: string | null;
  };
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: "playlist";
};

export type SpotifyPlaylistResponse = SpotifyPlaylistObject & {
  tracks: {
    href: "https://api.spotify.com/v1/me/shows?offset=0&limit=20";
    limit: 20;
    next: "https://api.spotify.com/v1/me/shows?offset=1&limit=1";
    offset: 0;
    previous: "https://api.spotify.com/v1/me/shows?offset=1&limit=1";
    total: 4;
    items: [
      {
        added_at: string;
        added_by: SpotifyBaseObject & {
          external_urls: SpotifyExternalUrlsObject;
          followers: SpotifyFollowerObject;
          type: "user";
        };
        is_local: boolean;
        track: SpotifyTrackResponse;
      }
    ];
  };
};
