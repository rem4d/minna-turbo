import type { Database, SupabaseClient } from "@rem4d/db";

export const getUserByTelegramId = async function (
  telegramId: number,
  db: SupabaseClient<Database>,
) {
  const { data, error } = await db
    .from("users")
    .select("*")
    .eq("telegram_id", telegramId);

  if (data && data.length > 0) {
    return data[0];
  }

  console.log(`getUserByTelegramId: no user has been found:`);
  console.log(error);
  return null;
};
