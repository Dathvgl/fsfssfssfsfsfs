import { config } from "dotenv";
config();

export const envs = process.env;

import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import errorHandler from "middlewares/errorHandler";
import ApiRoute from "routes/api";

process.setMaxListeners(0);

const app: Application = express();
const port: number = Number(process.env.PORT) || 8080;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api", ApiRoute);

app.get("/", async (req, res) => {
  res.send("Hello from ts");
});

app.get("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server: http://localhost:${port}/`);
});

app.use(errorHandler);
