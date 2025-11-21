import type { Database, SupabaseClient } from "@rem4d/db";

export const getUserByTelegramId = async function (
  telegramId: number,
  db: SupabaseClient<Database>,
) {
  const { data, error } = await db
    .from("users")
    .select("*")
    .eq("telegram_id", telegramId.toString());

  if (data && data.length > 0) {
    const found = data[0];

    if (found) {
      const u = {
        ...found,
        id: found.id.toString(),
      };

      return u;
    }
  }

  console.log(`getUserByTelegramId: no user has been found:`);
  console.log(error);
  return null;
};
