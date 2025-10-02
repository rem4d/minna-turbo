// mistral
const model = "pixtral-large-latest";
const uri = "https://api.mistral.ai/v1/chat/completions";

// const uri = "https://openai.api.proxyapi.ru/v1/chat/completions";
// // const model = 'anthropic/claude-sonnet-4-20250514'
// const model = "openai/gpt-4o";
// "model": "gpt-4o-2024-08-06",
// gpt-4o-mini-2024-07-18

// const model = "openai/gpt-5-chat-latest";

export default async function callApi<T>(prompt: string) {
  // console.log("Call API... ");
  // console.log(prompt);

  const response = await fetch(uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      // Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.log(text);
    return null;
  }

  try {
    const data = (await response.json()) as unknown as {
      choices: { message: { content: string } }[];
    };
    // console.log(JSON.stringify(data, undefined, 2));

    const content = data.choices[0]?.message.content ?? "";

    try {
      // const res = parseArray<T>(content);
      const res = JSON.parse(content);
      return res;
    } catch (err) {
      console.log("Error while parsing JSON. Response:");
      console.log(JSON.stringify(data, undefined, 2));
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

function parseArray<T>(response: string) {
  // const response =
  //   '```json\n[\n  {\n    "gloss": "〜は",\n    "comment": "indicates topic"\n  },\n  {\n    "gloss": "〜で",\n    "comment": "indicates means or method"\n  },\n  {\n    "gloss": "〜がる",\n    "comment": "indicates showing signs of emotion or desire"\n  },\n  {\n    "gloss": "〜ている",\n    "comment": "indicates ongoing action or state"\n  }\n]\n```';

  let processed = response;
  processed = processed.replace(/^```json/, "");
  processed = processed.replace(/```$/, "");

  const arr = JSON.parse(processed) as unknown as T;
  return arr;
}
