import { Envs } from "~/types/env";

export const envs: Envs = JSON.parse(JSON.stringify(import.meta.env));
export const envsSpotifyClientId = envs.VITE_SPOTIFY_CLIENT_ID ?? "";
export const envsSpotifyClientSecret = envs.VITE_SPOTIFY_CLIENT_SECRET ?? "";
