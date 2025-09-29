import { z } from "zod";
import { publicProcedure, router } from "../../trpc";

export const adminGlossRouter = router({
  getGlosses: publicProcedure
    .input(z.object({ limit: z.number().gt(0), page: z.number() }))
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;
      const { data, error } = await ctx.db
        .from("glosses")
        .select("*,gloss_sentence()")
        .eq("is_hidden", false)
        .not("gloss_sentence", "is", null)
        .range((page - 1) * limit, page * limit);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }),
  getAllGlosses: publicProcedure.mutation(async ({ ctx }) => {
    const { data, error } = await ctx.db
      .from("glosses")
      .select()
      .eq("is_hidden", false);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }),
  glossesTotal: publicProcedure.query(async ({ ctx }) => {
    const { count: total, error } = await ctx.db
      .from("glosses")
      .select("*,gloss_sentence()", { count: "exact" })
      .not("gloss_sentence", "is", null)
      .eq("is_hidden", false);

    if (error) {
      throw new Error(error.message);
    }

    return total;
  }),
  getSentencesByGloss: publicProcedure
    .input(z.object({ glossId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const glossId = input.glossId;

      const { data, error } = await ctx.db
        .from("gloss_sentence")
        .select("id:sentence_id,...sentences(text,text_with_furigana,en,ru)")
        .eq("gloss_id", glossId);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    }),
  setHidden: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.db
        .from("glosses")
        .update({ is_hidden: true })
        .eq("id", input);

      if (error) {
        throw new Error(error.message);
      }
      return true;
    }),
  askAi: publicProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ input }) => {
      const uri = "https://api.mistral.ai/v1/chat/completions";
      // console.log(input.prompt);
      const response = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: "mistral-large-latest",
          messages: [
            {
              role: "user",
              // content: "what is the time?",
              content: input.prompt,
            },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.log("NOT_OK");
        console.log(text);
        throw new Error(text);
      }

      console.log("GOT DATA");
      try {
        const data = (await response.json()) as unknown as {
          choices: { message: { content: string } }[];
        };
        console.log(JSON.stringify(data, undefined, 2));

        const content = data.choices[0]?.message.content ?? "";
        const res = JSON.parse(content);
        console.log(res);
        return res;
      } catch (err) {
        console.log(err);
        return [];
      }
      return true;
    }),
});
