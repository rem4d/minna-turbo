import { publicProcedure, router } from "../trpc";
import { Kanji, Sentence, SentenceMember, SentenceMemberInput } from "../types";
import { analyze } from "../util/analyze";
import { DeepLDictionary } from "../util/parse/puppetDict";
import { sleep } from "../util/sleep";
import { tokenize } from "../util/tokenizer/tokenize";

/*
http://localhost:1222/trpc/api/batch.batchSentences?batch=1
*/
export const batchRouter = router({
  batchSentences: publicProcedure.query(async ({ ctx }) => {
    const source = "source2";
    const data = await ctx.db
      .from("sentences")
      .select("*")
      .eq("source", source);
    const newSentences: Omit<Sentence, "updated_at">[] = [];

    const MAX = 1000000000;

    if (data.data) {
      let cnt = 0;
      console.log(
        `Found ${data.data.length} sentences for source "${source}".`,
      );

      const allKanjiMap = new Map<string, Kanji>();
      const { data: kanjis } = await ctx.db.from("kanji").select();
      if (kanjis) {
        kanjis.forEach((d) => {
          allKanjiMap.set(d.kanji, d);
        });
      }
      for (const s of data.data) {
        if (cnt > MAX) break;
        console.log(`Processing ${s.id}`);
        const result = await analyze(s, allKanjiMap);
        newSentences.push({
          id: s.id,
          text: s.text,
          en: s.en,
          ru: s.ru,
          created_at: s.created_at,
          source: s.source,
          translation: s.translation,
          // new fields
          text_with_furigana: result.textWithHiragana,
          ruby: result.ruby,
          level: result.newLevel,
          unknown_kanji_number: result.unknownKanjiNumber,
        });
        cnt++;
      }

      try {
        await ctx.db
          .from("sentences")
          .upsert(newSentences, { onConflict: "id" });
      } catch (error) {
        console.log(error);
      }
      console.log("Done.");
    }
  }),
  batchTranslations: publicProcedure.mutation(async ({ ctx }) => {
    const data = await ctx.db
      .from("sentences")
      .select()
      .eq("source", "source2")
      .gt("level", 0);

    const existingMembersMap: Map<string, SentenceMember> = new Map();

    const { data: got } = await ctx.db.from("sentence_members").select();

    if (got) {
      got.forEach((d) => {
        existingMembersMap.set(
          mapKeyFn({
            basic_form: d.basic_form,
            pos: d.pos,
            pos_detail_1: d.pos_detail_1,
          }),
          d,
        );
      });
    }

    // console.log("Existing: ", existingMembersMap.size);
    const map_new = new Map<string, SentenceMemberInput>();

    if (data.data) {
      console.log(`Data length ${data.data?.length}`);

      let cnt = 1;
      let checkingIndex = 0;
      // console.log(existingMembersMap);

      for (const sentence of data.data) {
        checkingIndex++;

        const tokens = await tokenize(sentence.text);

        for (const t of tokens) {
          if (typesToIgnore.includes(t.pos)) {
            continue;
          }
          const T_KEY = mapKeyFn(t);

          if (existingMembersMap.get(T_KEY)) {
            continue;
          } else {
            const newMemberInput: SentenceMemberInput = {
              basic_form: t.basic_form,
              pos: t.pos,
              original_sentence: sentence.text,
              pos_detail_1: t.pos_detail_1,
              en: null,
              is_invalid: false,
              is_hidden: false,
              other: [],
            };

            console.log(
              `Checking ${t.basic_form} from ${t.original} (${t.pos},${t.pos_detail_1}) (${checkingIndex}/${data.data.length}):`,
            );
            const result = await DeepLDictionary(t.basic_form);

            if (result.en && result.en.length > 0) {
              console.log(result.en);

              newMemberInput.en = result.en[0] ?? "";
              newMemberInput.other = result.en;
              map_new.set(T_KEY, newMemberInput);
            } else {
              console.log(
                `Could not parse results for: ${t.basic_form} (${t.pos})`,
              );
              newMemberInput.is_invalid = true;
            }

            await sleep(10);
            const { error } = await ctx.db
              .from("sentence_members")
              .insert(newMemberInput);

            if (error) {
              console.log(
                `Error when insert ${newMemberInput.basic_form} (${newMemberInput.pos},${newMemberInput.pos_detail_1})`,
              );
            } else {
              console.log(
                `Inserted at ${cnt}: ${newMemberInput.basic_form} (${newMemberInput.pos},${newMemberInput.pos_detail_1})`,
              );
            }

            cnt++;
            existingMembersMap.set(T_KEY, {
              ...newMemberInput,
              created_at: "",
              is_hidden: false,
              is_invalid: false,
              id: 0,
              m_type: "",
              other: [],
              ru: null,
            });
          }
        }
      }
    }
    return true;
  }),
});

const typesToIgnore = [
  "assistant",
  "symbol",
  "prefix",
  "interjection",
  "フィラー",
];

type MapKeyFnType = <
  T extends { basic_form: string; pos: string; pos_detail_1: string },
>(
  arg: T,
) => string;

const mapKeyFn: MapKeyFnType = (t) =>
  `${t.basic_form}_${t.pos}_${t.pos_detail_1}`;
