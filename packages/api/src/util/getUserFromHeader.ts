import { validate, parse } from "@telegram-apps/init-data-node";

const BOT_TOKEN = process.env.BOT_TOKEN ?? "";

export function getUserFromHeader(authHeader?: string) {
  if (!authHeader) {
    console.log(`Error: could not find auth header.`);
    return null;
  }

  const [authType, initData = ""] = authHeader.split(" ");

  if (authType !== "tma") {
    return null;
  }

  const parsed = parse(initData);
  const tgUser = parsed.user;

  if (!tgUser) {
    console.log("No user has been found when parse init data.");
    return null;
  }

  // @TODO: add more appropriate check
  if (tgUser.username === "rogue") {
    const rogue = {
      id: tgUser.id,
      telegram_username: tgUser.username,
      username: tgUser.username,
      first_name: tgUser.first_name,
      last_name: tgUser.last_name,
      language: tgUser.language_code,
    };
    return rogue;
  }

  try {
    validate(initData, BOT_TOKEN);
    const user = {
      id: tgUser.id,
      username: tgUser.username,
      first_name: tgUser.first_name,
      last_name: tgUser.last_name,
      language: tgUser.language_code,
    };
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
}
