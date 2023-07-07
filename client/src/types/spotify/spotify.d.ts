export type SpotifyResponse = {
  expires_in: number;
  access_token: string;
  refresh_token: string;
};

export type SpotifyInit = {
  expiresIn: number;
  accessToken: string;
  refreshToken: string;
};

export type SpotifyPaging<T> = {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: T[];
};

export type SpotifyExternalUrlsObject = {
  spotify: string;
};

export type SpotifyRestrictionsObject = {
  reason: "market" | "product" | "explicit";
};

export type SpotifyExternalIdObject = {
  isrc: string;
  ean: string;
  upc: string;
};

export type SpotifyImageObject = {
  url: string;
  height: number | null;
  width: number | null;
};

export type SpotifyCopyrightObject = {
  text: string;
  type: string;
};

export type SpotifyBaseObject = {
  href: string;
  id: string;
  name: string;
  uri: string;
};

export type SpotifyFollowerObject = {
  href: string | null;
  total: number;
};
