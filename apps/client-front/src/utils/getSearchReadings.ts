import memoize from "memoize";
import { toHiragana, toRomaji } from "wanakana";

import type { KanjiOutput } from "@minna/api";

function getSearchReadings(kanji: KanjiOutput) {
  const kuns = (kanji.kun ?? []).flatMap((k) => splitOne(k));
  const kunsInRomaji = kuns.map((k) => toRomaji(k));

  const ons = kanji.on_ ?? [];
  const onsInHiragana = ons.map((o) => toHiragana(o));
  const onsInRomaji = ons.map((o) => toRomaji(o));

  const en = kanji.en?.toLowerCase() ?? "";
  const ru = kanji.ru?.toLowerCase() ?? "";
  const words = [
    ...kuns,
    ...kunsInRomaji,
    ...ons,
    ...onsInHiragana,
    ...onsInRomaji,
    en,
    ru,
  ];
  return words;
}

function splitOne(source: string) {
  const head = /^.+?(?=\()/;
  const braces = /(?<=\().+?(?=\))/;
  const h = head.exec(source)?.[0] ?? "";

  const r =
    braces
      .exec(source)?.[0]
      .split(/[,-]+/)
      .filter((v) => v.length > 0) ?? [];

  return r.map((v) => `${h}${v}`);
}

const memoized = memoize(getSearchReadings);
export default memoized;
