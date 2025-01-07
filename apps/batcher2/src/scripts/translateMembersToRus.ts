import db from "@rem4d/db/client";
import { DeepLTranslate } from "../puppet/deepL";

export const translateMembersToRus = async () => {
  const { data, error } = await db
    .from("sentence_members")
    .select()
    .eq("pos", "verb")
    .order("id");

  if (error) {
    throw new Error(error.message);
  }
  console.log(`${data.length} members found.`);

  let cnt = 1;
  for (const m of data) {
    if (!m.en) {
      continue;
    }
    const result = await DeepLTranslate(m.en);
    console.log(result);

    if (result.ru) {
      await db
        .from("sentence_members")
        .update({ ru: result.ru })
        .eq("id", m.id);
      cnt++;
      console.log(`${cnt}. Updated member ${m.id}`);
    } else {
      console.log(`Could not find translation for member: ${m.id}: ${m.en}`);
    }
  }
};
