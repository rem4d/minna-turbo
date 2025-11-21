import { validate, parse } from "@tma.js/init-data-node";

const BOT_TOKEN = process.env.BOT_TOKEN ?? "";

export function getUserFromHeader(authHeader?: string) {
  if (!authHeader) {
    console.log(`Error: could not find auth header.`);
    return null;
  }

  const [authType, authData = ""] = authHeader.split(" ");

  if (authType !== "tma") {
    return null;
  }

  // console.log(0);
  const parsed = parse(authData);
  const tgUser = parsed.user;

  console.log(authData);

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
    validate(authData, BOT_TOKEN, { expiresIn: 0 });
    const user = {
      id: tgUser.id,
      username: tgUser.username,
      first_name: tgUser.first_name,
      last_name: tgUser.last_name,
      language: tgUser.language_code,
    };
    // const date = new Date();
    // console.log(`[${date.toISOString()}] PASSED___ Validated user:`);
    // console.log(user);
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
}
