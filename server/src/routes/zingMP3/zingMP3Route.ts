import { Router } from "express";
import tryCatch from "utils/tryCatch";
import { ZingMP3Controller } from "./zingMP3Controller";

const zingMP3Route = Router();

zingMP3Route.get("/song/:id", tryCatch(ZingMP3Controller.song));
zingMP3Route.get(
  "/detailPlaylist/:id",
  tryCatch(ZingMP3Controller.detailPlaylist)
);
zingMP3Route.get("/home", tryCatch(ZingMP3Controller.home));
zingMP3Route.get("/top100", tryCatch(ZingMP3Controller.top100));
zingMP3Route.get("/chartHome", tryCatch(ZingMP3Controller.chartHome));
zingMP3Route.get("/newReleaseChart", tryCatch(ZingMP3Controller.newRelease));
zingMP3Route.get("/infoSong/:id", tryCatch(ZingMP3Controller.infoSong));
zingMP3Route.get("/artist/:id", tryCatch(ZingMP3Controller.artist));
zingMP3Route.get(
  "/listArtistSong/:id",
  tryCatch(ZingMP3Controller.listArtistSong)
);
zingMP3Route.get("/lyris/:id", tryCatch(ZingMP3Controller.lyris));
zingMP3Route.get("/search/:name", tryCatch(ZingMP3Controller.search));
zingMP3Route.get("/listMv/:id", tryCatch(ZingMP3Controller.listMv));
zingMP3Route.get("/categoryMv/:id", tryCatch(ZingMP3Controller.categoryMv));
zingMP3Route.get("/video/:id", tryCatch(ZingMP3Controller.video));

export default zingMP3Route;
