import type { Tool } from "@mistralai/mistralai/models/components";

export interface AIMember {
  original: string;
  pos: string;
  dict_form: string;
  en: string;
  ru: string;
  reading: string;
}

export const tools: Tool[] = [
  {
    type: "function",
    function: {
      name: "filterByPartOfSpeech",
      description: "Filters parts of speech by part of speech (pos).",
      parameters: {
        type: "object",
        properties: {
          members: {
            type: "array",
            description: "Array of parts of speech.",
            items: {
              type: "object",
              properties: {
                original: {
                  type: "string",
                },
                pos: {
                  type: "string",
                },
                dict_form: {
                  type: "string",
                },
                en: {
                  type: "string",
                },
                ru: {
                  type: "string",
                },
                reading: {
                  type: "string",
                },
              },
              required: ["original", "pos", "dict_form"],
            },
          },
        },
      },
    },
  },
];

export const namesToFunctions = {
  filterByPartOfSpeech: (members: AIMember[]) => filterByPartOfSpeech(members),
};

export function filterByPartOfSpeech(members: AIMember[]) {
  return members.filter((m) => m.pos !== "particle");
}
