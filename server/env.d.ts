declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      ACCESS_TOKEN_EXPIRE?: string;
      REFRESH_TOKEN_EXPIRE?: string;
      ACCESS_TOKEN_SECRET?: string;
      REFRESH_TOKEN_SECRET?: string;
      MONGO_URL?: string;
      MONGO_DB?: string;
      ORIGIN_CORS?: string;
      NETTRUYEN?: string;
      SPOTIFY_REDIRECT_URI?: string;
      SPOTIFY_CLIENT_ID?: string;
      SPOTIFY_CLIENT_SECRET?: string;
    }
  }
}

export {};
