import fs from "node:fs";
import { Request, Response } from "express";
import { EdgeTTS } from "node-edge-tts";

const tts = new EdgeTTS({
  voice: "ja-JP-NanamiNeural",
  lang: "ja-JP",
});

export const ttsReq = async (req: Request, res: Response) => {
  const text = req.body.text as string;
  const filePath = "public/m/default.wav";

  try {
    await tts.ttsPromise(text, filePath);
    const rs = fs.createReadStream(filePath);
    res.setHeader("Content-Type", "audio/wav");
    rs.pipe(res);
  } catch (err) {
    console.log(err);
    throw new Error("Unexpected tts error.");
  }
};
