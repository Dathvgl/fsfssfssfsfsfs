import { Request, Response } from "express";
import { envs } from "index";
import { CustomError } from "models/errror";
import SpotifyWebApi from "spotify-web-api-node";
import { SpotifyResponse } from "types/spotify/spotify";

type SpotifyAuthType = {
  body: SpotifyResponse & {
    scope: string;
  };
};

export abstract class SpotifyController {
  static async auth(req: Request, res: Response) {
    const { code } = req.body;

    const spotifyApi = new SpotifyWebApi({
      redirectUri: envs.SPOTIFY_REDIRECT_URI,
      clientId: envs.SPOTIFY_CLIENT_ID,
      clientSecret: envs.SPOTIFY_CLIENT_SECRET,
    });

    await spotifyApi
      .authorizationCodeGrant(code)
      .then(({ body }: SpotifyAuthType) => {
        res.status(200).json({
          accessToken: body.access_token,
          refreshToken: body.refresh_token,
          expiresIn: body.expires_in,
        });
      })
      .catch(() => {
        throw new CustomError("Error spotify auth", 400);
      });
  }

  static async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;

    const spotifyApi = new SpotifyWebApi({
      clientId: envs.SPOTIFY_CLIENT_ID,
      clientSecret: envs.SPOTIFY_CLIENT_SECRET,
      refreshToken,
    });

    await spotifyApi
      .refreshAccessToken()
      .then(({ body }) => {
        res.status(200).json({
          accessToken: body.access_token,
          expiresIn: body.expires_in,
        });
      })
      .catch(() => {
        throw new CustomError("Error spotify refresh", 400);
      });
  }
}
