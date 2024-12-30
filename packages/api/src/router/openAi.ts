import OpenAI from "openai";
// import fs from "node:fs";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";

const openai = new OpenAI();

export const openAiRouter = router({
  check: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    const t = input;
    const content = `check grammar and translate ${t}`;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content,
        },
      ],
    });
    const choice = completion.choices[0];
    return choice?.message?.content ?? "";
  }),
  batch: publicProcedure.query(async () => {
    /*
    const sample = ``;
    const sentences = sample
      .replace(/\n+/g, ";")
      .replace(/\s/g, "")
      .split(";")
      .filter((s) => s.length > 0);

    const ws = fs.createWriteStream("message.txt", {
      flags: "w",
      encoding: "utf-8",
    });

    const sleep = async (sec: number) => {
      console.log(`Sleep ${sec} sec`);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(1);
        }, sec * 1000);
      });
    };

    let i = 0;

    console.log(`Found ${sentences.length} sentences`);

    while (true) {
      console.log("Take sentence at index " + i);

      if (i >= sentences.length) {
        break;
      }

      if (sentences[i]?.length === 0) {
        i++;
        console.warn("Skip empty string. Make index = ", i);
      }

      await sleep(30);

      try {
        console.info("Call API: ", sentences[i]);
        const r = await this.callApi(sentences[i]);
        if (r) {
          console.log("Got response. Write to file.");
          ws.write(sentences[i] + "\n");
          ws.write(JSON.stringify(r, null, 2) + "\n\n");
        } else {
          console.error("Empty msg from api!");
        }
        i++;
      } catch (err) {
        console.error("OpeanAI error:", err);
        await sleep(30);
      }
    }
    ws.close();
    console.log("Close file.");
    */
  }),
});
