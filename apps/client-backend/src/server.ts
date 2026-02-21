import http from "http";
// import { RedisClientType } from "@redis/client";
import * as trpcExpress from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { appRouter, createContextFactory } from "@rem4d/api";

import logger from "./logger";
import errorMiddleware from "./middleware/errorMiddleware";
import { sessionMiddleware } from "./middleware/sessionMiddleware";
import { ttsReq } from "./middleware/ttsMiddleware";
import redis from "./redisClient";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(sessionMiddleware);

export let httpServer: ReturnType<typeof http.createServer>;

const redisClient: any = redis;
const createContextBase = createContextFactory({ redis: redisClient });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(express.static("public"));

app.use(
  "/trpc/api",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: (opts) =>
      createContextBase(opts, { sessionId: opts.req.sessionId }),
  }),
);

app.get("/tts/ms-tts", ttsReq);

app.use(errorMiddleware);

export { app, logger };
