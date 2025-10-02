import { expect, describe, test } from "vitest";
import { processSentenceGlosses } from "../src//process";

describe("process: no exceptions in db", () => {
  // check NO exceptions (number must be null)
  const aiGlosses = [
    {
      gloss: "〜とき",
      comment: "comment 1",
    },
    {
      gloss: "〜した",
      comment: "comment 2",
    },
  ];

  test("if both exist return both relations", async () => {
    const result = await processSentenceGlosses({
      sentence: { id: 1, text: "sentence text" },
      dbGlosses: [
        {
          id: 15,
          kana: "〜とき",
          number: null,
          tmp: "[2]<comment 2>",
        },
        {
          id: 16,
          kana: "〜した",
          number: null,
          tmp: null,
        },
      ],
      aiGlosses,
      callAiForExceptionNumber: async () =>
        new Promise((resolve) =>
          resolve({ closest: [1], comment: null, success: true }),
        ),
    });
    expect(result.newGlosses.length).toEqual(0);
    expect(result.newRelations.length).toEqual(2);
    expect(result.newRelations).toContainEqual({
      sentenceId: 1,
      glossId: 15,
    });
    expect(result.newRelations).toContainEqual({
      sentenceId: 1,
      glossId: 16,
    });
    expect(result.glossesToUpdate).toContainEqual({
      id: 15,
      tmp: "[2]<comment 2>;[1]<comment 1>",
    });
  });
});

describe("process: have zero or one exception in db", () => {
  const sentence = { id: 1, text: "日曜日、ともだちとふじ山へいきます。" };
  const aiGlosses = [
    {
      gloss: "〜と", // exception
      comment: "indicates with",
    },
    {
      gloss: "〜とし", // non-exception
      comment: "some comment",
    },
  ];

  describe("if matching exception exists in db", () => {
    test("if numbers matches return only relations", async () => {
      const result = await processSentenceGlosses({
        sentence,
        dbGlosses: [
          {
            id: 15,
            kana: "〜と",
            comment: "indicates with",
            number: 1, // exception
            tmp: null,
          },
          {
            id: 16,
            kana: "〜とし",
            comment: "some comment",
            number: null, // non-exception
            tmp: null,
          },
        ],
        aiGlosses,
        callAiForExceptionNumber: async () =>
          new Promise((resolve) =>
            resolve({ closest: [1], comment: null, success: true }),
          ),
      });
      expect(result.newGlosses.length).toEqual(0);
      expect(result.newRelations.length).toEqual(2);
      expect(result.newRelations).toContainEqual({
        sentenceId: sentence.id,
        glossId: 15,
      });
    });

    test("if numbers don't match create new exception & relation, update relation", async () => {
      const result = await processSentenceGlosses({
        sentence,
        dbGlosses: [
          {
            id: 15,
            kana: "〜と",
            comment: "indicates with",
            number: 2, // exception, but does not match 1
            tmp: null,
          },
          {
            id: 16,
            kana: "〜とし",
            comment: "some comment",
            number: null,
            tmp: null,
          },
        ],
        aiGlosses,
        callAiForExceptionNumber: async () =>
          new Promise((resolve) =>
            resolve({ closest: [1], comment: null, success: true }),
          ),
      });
      expect(result.newGlosses.length).toEqual(1);
      expect(result.newRelations.length).toEqual(2);
      expect(result.newRelations).toContainEqual({
        sentenceId: sentence.id,
        glossId: 16,
      });
      expect(result.newRelations).toContainEqual({
        sentenceId: sentence.id,
        glossId: null,
        glossKana: "〜と",
        glossComment: "indicates with",
        glossNumber: 1,
      });
    });
  });

  test("creates new glosses and new relations if not exist", async () => {
    const result = await processSentenceGlosses({
      sentence,
      dbGlosses: [],
      aiGlosses,
      callAiForExceptionNumber: async () =>
        new Promise((resolve) =>
          resolve({ closest: [1], comment: null, success: true }),
        ),
    });

    expect(result.newGlosses.length).toEqual(2);
    expect(result.newRelations.length).toEqual(2);
  });

  test("if 1 exist, create 1 gloss & relation, update 1 relation", async () => {
    const result = await processSentenceGlosses({
      sentence,
      dbGlosses: [
        {
          id: 15,
          kana: "〜と",
          comment: "indicates with",
          number: 1,
          tmp: null,
        },
      ],
      aiGlosses,
      callAiForExceptionNumber: async () =>
        new Promise((resolve) =>
          resolve({ closest: [1], comment: null, success: true }),
        ),
    });

    expect(result.newGlosses.length).toEqual(1);
    expect(result.newGlosses[0]?.number).toEqual(null);
    expect(result.newRelations.length).toEqual(2);
    expect(result.newRelations).toContainEqual({
      sentenceId: sentence.id,
      glossId: 15,
    });
    expect(result.newRelations).toContainEqual({
      sentenceId: sentence.id,
      glossId: null,
      glossKana: "〜とし",
      glossComment: "some comment",
      glossNumber: null,
    });
  });
});
