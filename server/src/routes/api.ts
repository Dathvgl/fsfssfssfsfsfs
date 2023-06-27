import { Router } from "express";
import { authProtect } from "middlewares/authHandler";
import mangaFollowRoute from "./mangaFollow/mangaFollowRoute";
import mangaLibRoute from "./mangaLib/mangaLibRoute";
import todoRoute from "./todo/todoRoute";
import userRoute from "./user/userRoute";

const router = Router();

router.use("/user", userRoute);
router.use("/todo", authProtect, todoRoute);
router.use("/mangaLib", mangaLibRoute);
router.use("/mangaFollow", authProtect, mangaFollowRoute);

export default router;
