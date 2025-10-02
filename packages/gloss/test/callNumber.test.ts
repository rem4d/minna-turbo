import { expect, it, vi } from "vitest";

it("callAiForExceptionNumber: success", async () => {
  vi.doMock("../src/callApi", async () => ({
    default: vi.fn(() => ({ closest: [1] })),
  }));

  const { callAiForExceptionNumber } = await import(
    "../src/callApiForExceptionNumber"
  );
  const result = await callAiForExceptionNumber({
    gloss: "〜と",
    sentenceText: "text",
  });
  console.log(result);

  expect(result.success).toBe(true);
  expect(result.closest).toEqual([1]);
  expect(result.comment).toBe(null);
});
