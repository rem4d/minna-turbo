import type { Database, SupabaseClient } from "@rem4d/db";

export const getUserByTelegramId = async function (
  telegramId: number,
  db: SupabaseClient<Database>,
) {
  const data = await db.from("users").select("*").eq("telegram_id", telegramId);
  if (data.data && data.data.length > 0) {
    return data.data[0];
  }
  return null;
};
