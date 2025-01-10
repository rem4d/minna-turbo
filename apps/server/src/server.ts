import http from "http";
import cors from "cors";
import express, { Router } from "express";
import dotenv from "dotenv";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter, createTRPCContext } from "@rem4d/api";
import logger from "./logger";
import errorMiddleware from "./middleware/errorMiddleware";
import {
  playSpeaker,
  createSpeakerFile,
  removeSpeakerFile,
} from "./middleware/voicevoxMiddleware";

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

ttsRouter.post("/voicevox", playSpeaker);
ttsRouter.post("/voicevox_submit", createSpeakerFile);
ttsRouter.post("/voicevox_remove", removeSpeakerFile);

app.use("/api", ttsRouter);

app.use(errorMiddleware);

export { app, logger };
