import { Router } from "express";
import { authProtect } from "middlewares/authHandler";
import coverRoute from "./cover/coverRoute";
import mangaFollowRoute from "./mangaFollow/mangaFollowRoute";
import mangaLibRoute from "./mangaLib/mangaLibRoute";
import roomRoute from "./room/roomRoute";
import spotifyRoute from "./spotify/spotifyRoute";
import todoRoute from "./todo/todoRoute";
import userRoute from "./user/userRoute";
import zingMP3Route from "./zingMP3/zingMP3Route";

const router = Router();

router.use("/user", userRoute);
router.use("/cover", coverRoute);
router.use("/todo", authProtect, todoRoute);
router.use("/mangaLib", mangaLibRoute);
router.use("/mangaFollow", authProtect, mangaFollowRoute);
router.use("/room", roomRoute);
router.use("/spotify", spotifyRoute);
router.use("/zingMP3", zingMP3Route);

export default router;
