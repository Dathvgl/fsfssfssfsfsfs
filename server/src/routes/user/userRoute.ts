import { Router } from "express";
import { authProtect } from "middlewares/authHandler";
import { UserController } from "./userController";
import tryCatch from "utils/tryCatch";

const userRoute = Router();

userRoute.post("/register", tryCatch(UserController.register));
userRoute.post("/login", tryCatch(UserController.login));
userRoute.post("/logout", authProtect, tryCatch(UserController.logout));
userRoute.post("/refresh", tryCatch(UserController.refresh));
userRoute
  .route("/profile")
  .get(authProtect, tryCatch(UserController.getProfile))
  .put(authProtect, tryCatch(UserController.putProfile));

export default userRoute;
