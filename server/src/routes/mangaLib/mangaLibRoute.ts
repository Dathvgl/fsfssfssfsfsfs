import { Router } from "express";
import { MangaLibController } from "./mangaLibController";
import tryCatch from "utils/tryCatch";

const mangaLibRoute = Router();

mangaLibRoute.get("/genres", tryCatch(MangaLibController.genres));
mangaLibRoute.get("/lastest", tryCatch(MangaLibController.lastest));
mangaLibRoute.get("/search", tryCatch(MangaLibController.search));
mangaLibRoute.get("/genreList", tryCatch(MangaLibController.genreList));
mangaLibRoute.get("/manga", tryCatch(MangaLibController.manga));
mangaLibRoute.get("/chapter", tryCatch(MangaLibController.chapter));

export default mangaLibRoute;
