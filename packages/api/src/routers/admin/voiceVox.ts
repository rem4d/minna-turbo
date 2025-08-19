import { publicProcedure, router } from "../../trpc";
import { z } from "zod";
import { sleep } from "../../util/sleep";

const speaker = 88;
const speed = 1.0;
const host = "http://127.0.0.1:50021";

async function createAutio(text: string) {
  console.log("createAutio start!");
  console.log("____________________________");
  const url = `${host}/audio_query?text=${text}&speaker=${speaker}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "*/*",
    },
  });
  const speechData = await response.json();
  console.log("Got speechData response: ", response.status);

  const url2 = `${host}/synthesis?speaker=${speaker}`;
  return fetch(url2, {
    method: "POST",
    // body: JSON.stringify({ ...speechData, speedScale: speed }),
    body: JSON.stringify({}),
    headers: {
      "Content-type": "application/json",
    },
  });
}

export const voicevoxRouter = router({
  synthesize: publicProcedure.input(z.string()).mutation(async function* ({
    input,
  }) {
    const res = await createAutio(input);
    const reader = res.body?.getReader();

    let done2 = false;

    if (reader) {
      while (!done2) {
        const res = await reader.read();
        console.log(res);
        await sleep(2);

        if (res.done) {
          done2 = true;
        }
        yield res.value;
      }
    }
    console.log("Done!");
  }),
});
