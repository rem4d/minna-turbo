import { tokenize } from "../src/index";
import { expect, test } from "vitest";
import * as basicData from "./filterList.mockData";

test("Tokenize test.", async () => {
  // const text = "かれらは廊下の目立たない部分へ行った。";
  // const tokens = await tokenize(text);
  // console.log(tokens);
});

/*
test("[Filter_list]: Joining tokens into single.", async () => {
  // two separate tokens "い" and "たい" join into "いたい"
  const text = "背中がいたいです。";
  const tokens = await tokenize(text);

  expect(tokens).toHaveLength(5);
  expect(tokens).toContainEqual(
    expect.objectContaining({
      basic_form: "いたい",
      reading: "いたい",
      pos: "adjective",
    }),
  );
});

test("[Filter_list]: Use an exception from list.", async () => {
  const text = "わたしは一人で日本へきました。";
  const tokens = await tokenize(text);

  expect(tokens).toHaveLength(10);
  expect(tokens).toContainEqual(
    expect.objectContaining({
      basic_form: "一人", // exception itself
      reading: "ひとり", // reading from filter list
      pos: "noun", // pos from filter list or default 'noun'
      pos_detail_1: "replaced",
    }),
  );
});

test("[Filter_list]: Additonal test.", async () => {
  // const text = "明日は必ず終わるようにしてくださいね。";
  // '助動詞語幹',
  const text = "このワインは八本二千円です";
  const tokens = await tokenize(text);
  console.log(tokens);
});
*/
