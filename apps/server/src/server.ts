import http from "http";
import cors from "cors";
import express, { Router } from "express";
import dotenv from "dotenv";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter, createTRPCContext } from "@rem4d/api";
import logger from "./logger";
import errorMiddleware from "./middleware/errorMiddleware";
import { Request, Response, NextFunction } from "express";
import { Readable } from "stream";
// import ttsMiddleware from "./middleware/ttsMiddleware";

dotenv.config();

const app = express();

const ttsRouter: Router = express.Router();
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

ttsRouter.get(
  "/voicevox",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const text = req.query.text as string;
    const speaker = 88;
    const speed = 1.0;
    // const host = "http://159608.msk.web.highserver.ru";
    const host = "http://127.0.0.1:50021";

    console.log("createAutio start!");
    console.log("____________________________");
    const url = `${host}/audio_query?text=${text}&speaker=${speaker}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*/*",
      },
    });
    const speechData = (await response.json()) as unknown as Record<
      string,
      string
    >;
    console.log("Got speechData response: ", response.status);

    res.setHeader("Content-Type", "audio/wav");
    const url2 = `${host}/synthesis?speaker=${speaker}`;

    const r2 = await fetch(url2, {
      method: "POST",
      body: JSON.stringify({ ...speechData, speedScale: speed }),
      headers: {
        "Content-type": "application/json",
      },
    });
    console.log(r2.body);
    if (r2.body) {
      Readable.fromWeb(r2.body).pipe(res);
    } else {
    }
    // r2.body?.pipe(res);
  },
);
app.use("/api", ttsRouter);
// app.get("/api/voicevox", ttsMiddleware);

app.use(errorMiddleware);

export { app, logger };
