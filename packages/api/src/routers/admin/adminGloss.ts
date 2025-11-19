import { z } from "zod";
import { publicProcedure, router } from "../../trpc";

export const adminGlossRouter = router({
  getGlosses2: publicProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.db
      .from("glosses")
      .select("*")
      .eq("is_hidden", false)
      .order("code")
      .not("code", "is", null);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }),
  getSentencesByGloss: publicProcedure
    .input(z.object({ glossId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const glossId = input.glossId;

      const { data, error } = await ctx.db
        .from("gloss_sentence")
        .select("id:sentence_id,...sentences(*)")
        .eq("gloss_id", glossId)
        .order("sentences(created_at)", { ascending: false })
        .limit(100);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    }),
  findByFilter: publicProcedure
    .input(z.object({ kana: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.db
        .from("glosses")
        .select("*")
        .like("kana", `%${input.kana}%`);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }),
  grammarify: publicProcedure
    .input(z.object({ sentenceId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { data: sentence, error } = await ctx.db
        .from("sentences")
        .select("*")
        .eq("id", input.sentenceId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!sentence?.text) {
        throw new Error("No sentence found.");
      }
      const { data: dbGlosses, error: dbError } = await ctx.db
        .from("glosses")
        .select("*")
        .eq("is_hidden", false);

      if (dbError || !dbGlosses) {
        throw new Error("No glosses found");
      }

      const res = await fetch("http://127.0.0.1:5000/glosses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: sentence.text,
        }),
      });

      if (!res.ok) {
        console.log(res);
        throw new Error("Failed to fetch response");
      }
      const response = (await res.json()) as unknown as {
        gloss: string;
        start: number;
        end: number;
      }[];

      const bulks: {
        sentence_id: number;
        gloss_id: number;
        start: number;
        end: number;
      }[] = [];

      for (const gloss of response) {
        const foundGloss = dbGlosses.find((g) => g.code === gloss.gloss);

        if (!foundGloss || error) {
          console.log(gloss.gloss);
          throw new Error("No gloss found");
        }

        bulks.push({
          sentence_id: sentence.id,
          gloss_id: foundGloss.id,
          start: gloss.start,
          end: gloss.end,
        });
      }

      const { error: errDelete } = await ctx.db
        .from("gloss_sentence")
        .delete()
        .eq("sentence_id", sentence.id);

      if (errDelete) {
        throw new Error(errDelete.message);
      }

      const { error: errorBulk } = await ctx.db
        .from("gloss_sentence")
        .insert(bulks);

      if (errorBulk) {
        throw new Error(errorBulk.message);
      }
      return true;
    }),
});
