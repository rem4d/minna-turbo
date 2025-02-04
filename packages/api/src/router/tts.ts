import fs from "node:fs";
import path from "path";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { finished } from "node:stream/promises";

import { fileURLToPath } from "url";
import { sleep } from "../util/sleep";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const speaker = 88;
const speed = 1.0;
// const host = "http://159608.msk.web.highserver.ru";
const host = "http://127.0.0.1:50021";

async function createAutio(text: string) {
  console.log("createAutio start!");
  console.log("____________________________");
  const url = `${host}/audio_query?text=${text}&speaker=${speaker}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "*/*",
    },
  });
  const speechData = await response.json();
  console.log("Got speechData response: ", response.status);

  const url2 = `${host}/synthesis?speaker=${speaker}`;
  return fetch(url2, {
    method: "POST",
    body: JSON.stringify({ ...speechData, speedScale: speed }),
    headers: {
      "Content-type": "application/json",
    },
  });
  // for await (const chunk of res.body.values()) {
  // }

  /*
  console.log("status: ", result.status);
  const blob = await result.blob();
  if (result.body) {
    // const reader = result.body.getReader();
  }
  console.log(blob);
  return result.body;
  const buffer = await blob.arrayBuffer();
  const b = Buffer.from(buffer);

  const dir = path.resolve(path.join(__dirname, String(speaker + "wav")));

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const rs = fs.createReadStream(result);
  return rs;
    */

  // const ws = fs.createWriteStream(
  //   path.join(__dirname, String(speaker + "wav"), `default.wav`),
  // );
  //
  // ws.write(b);
  // ws.on("finish", () => {
  //   console.log("DONE!");
  // });
  //
  // console.log("Finish write file");
}

export const ttsRouter = router({
  synthesize: publicProcedure.input(z.string()).mutation(async function* ({
    input,
  }) {
    const res = await createAutio(input);
    const reader = res.body?.getReader();

    let done2 = false;

    if (reader) {
      while (!done2) {
        const res = await reader.read();
        console.log(res);
        await sleep(2);

        if (res.done) {
          done2 = true;
        }
        yield res.value;
      }
    }
    console.log("Done!");
  }),
});
