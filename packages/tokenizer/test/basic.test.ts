import { tokenize } from "../src/index";
import { expect, test } from "vitest";

test("[Filter_list]: Additonal test.", async () => {
  // const text = "明日は必ず終わるようにしてくださいね。";
  // '助動詞語幹',
  const text = "後で電話をいたします。";
  const tokens = await tokenize(text);
  console.log(tokens);
});
