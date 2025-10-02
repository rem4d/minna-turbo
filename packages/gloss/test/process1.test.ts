import { describe, test } from "vitest";

describe("process1: check callAiForExceptionNumber", () => {
  // const sentence = { id: 1, text: "日曜日、ともだちとふじ山へいきます。" };
  // const aiGlosses = [
  //   {
  //     gloss: "〜と", // exception
  //     comment: "indicates with",
  //   },
  //   {
  //     gloss: "〜とし", // non-exception
  //     comment: "some comment",
  //   },
  // ];

  test("if NO MATCH, return empty", async () => {
    // const result = await processSentenceGlosses({
    //   sentence,
    //   dbGlosses: [],
    //   aiGlosses: aiGlosses,
    //   callAiForExceptionNumber: async () => [],
    // });
    // console.log(result);
    // expect(result.newGlosses.length).toEqual(0);
    // expect(result.newRelations.length).toEqual(0);
  });
});
