import { Request, Response, RequestHandler, NextFunction } from "express";
import fs from "node:fs";
import { Readable } from "stream";
import { client as db } from "@minna/db";

export const playSpeaker = async (req: Request, res: Response) => {
  const text = req.body.text as string;
  const speaker = req.body.speaker as number;
  const speed = req.body.speed as number;

  const response = await createBuffer({ text, speaker, speed });

  if (response.ok && response.body) {
    res.setHeader("Content-Type", "audio/wav");
    Readable.fromWeb(response.body).pipe(res);
  } else {
    res.status(400).json({ msg: "Unexpected error!" });
  }
};

export const createSpeakerFile = async (req: Request, res: Response) => {
  const text = req.body.text as string;
  const speaker = req.body.speaker as number;
  const speed = req.body.speed as number;
  const sentenceId = req.body.sentenceId as number;

  const response = await createBuffer({ text, speaker, speed });

  if (response.ok && response.body) {
    const dir = new URL(`../../public/voices`, import.meta.url);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ws = fs.createWriteStream(`${dir.pathname}/${sentenceId}.wav`);
    ws.write(buffer);
    ws.end();

    ws.on("finish", async () => {
      console.log("DONE writing file!");

      const { error } = await db
        .from("sentences")
        .update({
          vox_file_path: `/voices/${sentenceId}.wav`,
          vox_speaker_id: speaker,
        })
        .eq("id", sentenceId);

      if (error) {
        res.status(400).json({ msg: "Unexpected error when write to db." });
      } else {
        res.status(200).json({ msg: "Ok." });
      }
    });
  } else {
    res.status(400).json({ msg: "Unexpected error!" });
  }
};

export const removeSpeakerFile = async (req: Request, res: Response) => {
  const sentenceId = req.body.sentenceId as number;

  const dir = new URL(`../../public/voices`, import.meta.url);

  const path = `${dir.pathname}/${sentenceId}.wav`;

  fs.unlink(path, async (err) => {
    if (err) throw err;
    console.log("Deleted file.");

    const { error } = await db
      .from("sentences")
      .update({
        vox_file_path: "default",
        vox_speaker_id: null,
      })
      .eq("id", sentenceId);

    if (error) {
      res.status(400).json({ msg: "Unexpected error when write to db." });
    } else {
      res.status(200).json({ msg: "File deleted." });
    }
  });
};

const createBuffer = async ({
  text,
  speaker,
  speed,
}: {
  text: string;
  speaker: number;
  speed: number;
}) => {
  // const host = "http://159608.msk.web.highserver.ru";
  const host = "http://127.0.0.1:50021";

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
  // console.log("Got speechData response: ", response.status);

  const url2 = `${host}/synthesis?speaker=${speaker}`;

  return fetch(url2, {
    method: "POST",
    body: JSON.stringify({
      ...speechData,
      speedScale: speed,
      volumeScale: 1.9,
    }),
    headers: {
      "Content-type": "application/json",
    },
  });
};
