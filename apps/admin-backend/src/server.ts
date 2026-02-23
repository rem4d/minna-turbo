import http from "http";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import dotenv from "dotenv";
import express, { Router } from "express";

import { appRouter, createContextFactory } from "@minna/api";

import logger from "./logger";
import errorMiddleware from "./middleware/errorMiddleware";
import {
  createSpeakerFile,
  playSpeaker,
  removeSpeakerFile,
} from "./middleware/voicevoxMiddleware";

dotenv.config();

const app = express();

export let httpServer: ReturnType<typeof http.createServer>;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(express.static("public"));

const createTRPCContext = createContextFactory({ redis: null });

app.use(
  "/trpc/api",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
  }),
);

const ttsRouter: Router = express.Router();

ttsRouter.post("/voicevox", playSpeaker);
ttsRouter.post("/voicevox_submit", createSpeakerFile);
ttsRouter.post("/voicevox_remove", removeSpeakerFile);

app.use("/api", ttsRouter);

app.use(errorMiddleware);

export { app, logger };
