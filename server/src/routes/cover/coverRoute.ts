import { Router } from "express";
import tryCatch from "utils/tryCatch";
import { CoverController } from "./coverController";

const coverRoute = Router();

coverRoute.get("/getCover/:id", tryCatch(CoverController.getCover));

export default coverRoute;
