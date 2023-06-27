import { Router } from "express";
import { MangaFollowController } from "./mangaFollowController";
import tryCatch from "utils/tryCatch";

const mangaFollowRoute = Router();

mangaFollowRoute.get(
  "/getFollows/:type",
  tryCatch(MangaFollowController.getFollows)
);
mangaFollowRoute.get(
  "/getFollow/:type/:path",
  tryCatch(MangaFollowController.getFollow)
);
mangaFollowRoute.get(
  "/getFollowChapter/:type/:path",
  tryCatch(MangaFollowController.getFollowChapter)
);
mangaFollowRoute.post(
  "/postFollow",
  tryCatch(MangaFollowController.postFollow)
);
mangaFollowRoute.put(
  "/putFollow/:id/:type",
  tryCatch(MangaFollowController.putFollow)
);
mangaFollowRoute.delete(
  "/deleteFollow/:id/:type",
  tryCatch(MangaFollowController.deleteFollow)
);

export default mangaFollowRoute;
