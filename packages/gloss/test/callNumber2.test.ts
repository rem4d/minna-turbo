import { expect, it, vi } from "vitest";

it("callAiForExceptionNumber: null", async () => {
  vi.doMock("../src/callApi", async () => ({
    default: vi.fn(() => null),
  }));

  const { callAiForExceptionNumber } = await import(
    "../src/callApiForExceptionNumber"
  );

  const result = await callAiForExceptionNumber({
    gloss: "〜と",
    sentenceText: "text",
  });

  expect(result.success).toBe(false);
});
