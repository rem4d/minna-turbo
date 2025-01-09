import { Request, Response, RequestHandler, NextFunction } from "express";
import { Readable } from "stream";
import logger from "../logger";

export default async function voicevoxMiddleware(
  req: Request,
  res: Response,
  // next: NextFunction,
): Promise<any> {
  const text = req.body.text as string;
  const speaker = req.body.speaker as number;
  // const speed = 1.0;
  const speed = req.body.speed as number;
  // const host = "http://159608.msk.web.highserver.ru";
  const host = "http://127.0.0.1:50021";
  console.log("createAutio start! ", text, " ", speaker);

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

  if (r2.ok && r2.body) {
    Readable.fromWeb(r2.body).pipe(res);
  } else {
    res.status(400).json({ msg: "Unexpected error!" });
  }
  // res.status(400).json({ msg: "Unexpected error has occurred." });
}
