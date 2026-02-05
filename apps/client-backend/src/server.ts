import http from "http";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import dotenv from "dotenv";
import express, { Router } from "express";

import { appRouter, createTRPCContext } from "@rem4d/api";

import logger from "./logger";
import errorMiddleware from "./middleware/errorMiddleware";
import { ttsReq } from "./middleware/ttsMiddleware";

dotenv.config();

const app = express();

export let httpServer: ReturnType<typeof http.createServer>;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(express.static("public"));

app.use(
  "/trpc/api",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
  }),
);

const ttsRouter: Router = express.Router();

ttsRouter.post("/ms-tts", ttsReq);

app.use("/tts", ttsRouter);

app.use(errorMiddleware);

export { app, logger };
