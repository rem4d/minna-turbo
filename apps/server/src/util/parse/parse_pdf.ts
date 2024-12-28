import fs from "node:fs";
import readLine from "readline";
import db from "../../config/db";
import { Sentence } from "../../types";
import { tmp } from "./l2";

export const scrape = async () => {
  const rep = tmp;
  // const reg = new RegExp(
  //   "^([~一-龠ぁ-ゔァ-ヴー() ]+)[ ]+[() a-zA-Z.]+[ ]+([一-龠ぁ-ゔァ-ヴー。、 !0-9]{5,}。)",
  //   "gm",
  // );

  const source2_reg =
    /^[0-9]{1,}.\s*([^A-Z]+。){1,}\n?\s*([a-zA-Z ().,\n’'-?\d“”]+$)/gm;
  // const reg =
  //   /^[0-9]{1,3}-[0-9]{1,3}.\s*([「」！×〇一-龠ぁ-ゔァ-ヴー ？、()。！]+)\n([「」！×〇一-龠ぁ-ゔァ-ヴー ？、()。！\n]+)(?=([a-zA-Z!' .,\-\"]+))/gm;

  const reg = source2_reg;
  // const rs = fs.createReadStream("eng_fixed.txt");
  // const ws = fs.createWriteStream("processed.json", {
  //   flags: "w",
  //   encoding: "utf-8",
  // });
  // const reader = readLine.createInterface({
  //   input: rs,
  // });
  //
  // const engFixed = [];
  // for await (const line of reader) {
  //   engFixed.push(line);
  // }
  //
  const arr = [...rep.matchAll(reg)];
  let cnt = 0;
  const sentencesToInsert: any[] = [];
  const inner_reg =
    /[\n ]*(?:[A-Z][\n a-z .();’,\d?!-]+)(?:[A-Z][\n a-z .();’,\d?!]+)?^([A-Z][\n a-zA-Z .():;’,'\d?!-]*)/m;

  for (let m of arr) {
    if (cnt > 10) break;
    const jp = m[1].replace(/\s/g, " ");
    const en = m[2]; // m[2].replace(/\n/g, "");
    // console.log({
    //   jp,
    //   en,
    // });
    const im = en.match(inner_reg);
    const n3end = /\.?(\d{1,3}-\d{1,3}.*)$/;

    if (im && im.length > 0) {
      let iff = im[1].replace(/\n/g, "");
      iff = iff.replace(n3end, "");
      // console.log(iff);

      sentencesToInsert.push({
        text: jp,
        translation: iff,
        source: "source2",
      });
    } else {
      // console.log("_____________No match found for: ", en);
    }
    // console.log(jp);
    // ws.write(jp + "\n");
    // ws.write(engFixed[cnt] + "\n\n");
    // cnt++;
  }

  // const result = await db.from("sentences").insert(sentencesToInsert);
  // console.log(result);
  // console.log(sentencesToInsert);
  console.log(sentencesToInsert.length);
  console.log("Done");
  //
  // logger.info("File written.");
  // ws.close();
};

// ([一-龠ぁ-ゔァ-ヴー。,!0-9]+。)
