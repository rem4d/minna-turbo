import db from "@rem4d/db/client";
import { DeepLTranslate } from "./deepL";
// import logger from "./logger";

const main = async () => {
  /*
  const { data, error } = await db
    .from("sentences")
    .select()
    .eq("source", "source1")
    .is("en", null)
    .order("id");

  if (error) {
    throw new Error(error.message);
  }
  console.log(`${data.length} sentences found.`);

  let cnt = 1;
  for (const sentence of data) {
    if (!sentence.translation) {
      continue;
    }
    const result = await DeepLTranslate(sentence.text);
    console.log(result);

    if (result.ru) {
      await db
        .from("sentences")
        .update({
          en: result.en,
          ru: result.ru,
        })
        .eq("id", sentence.id);
      cnt++;
      console.log(`${cnt}. Updated sentence ${sentence.id}`);
    } else {
      console.log(
        `Could not find translation for sentence: ${sentence.id}: ${sentence.text}`,
      );
    }
  }
  console.log("Translation done.");
  */
};

main();
