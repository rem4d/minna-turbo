import { translateMembersToRus } from "./scripts/translateMembersToRus";

const main = async () => {
  await translateMembersToRus();
  console.log("Done.");
};

main();
