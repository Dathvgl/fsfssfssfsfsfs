import { Router } from "express";
import tryCatch from "utils/tryCatch";
import { SpotifyController } from "./spotifyController";

const spotifyRoute = Router();

spotifyRoute.post("/auth", tryCatch(SpotifyController.auth));
spotifyRoute.post("/refresh", tryCatch(SpotifyController.refresh));

export default spotifyRoute;
