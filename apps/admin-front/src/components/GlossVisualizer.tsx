import { twMerge } from "tailwind-merge";

interface Gloss {
  code: string;
  start: number;
  end: number;
}

interface Props {
  text: string;
  glosses?: Gloss[];
}

export const GlossVisualizer = ({ text, glosses = [] }: Props) => {
  const spans = makeSpans(text, glosses);

  return <div className="mt-4">{spans}</div>;
};

type Code = string;
interface Gloss {
  char: string;
  code: Code;
  start: number;
  end: number;
}

const makeSpans = (text: string, glosses: Gloss[]) => {
  const arr: Gloss[] = [];

  for (const gloss of glosses) {
    // console.log(`Processing gloss: ${gloss.code}`);
    for (let i = gloss.start; i < gloss.end; i++) {
      if (!arr[i]) {
        arr[i] = {
          char: text[i],
          code: gloss.code,
          start: gloss.start,
          end: gloss.end,
        };
      }
    }
  }
  const map = new Map<string, { start: number; end: number }>();

  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      const k = `${arr[i].start}.${arr[i].end}`;
      if (map.has(k)) {
        map.set(k, {
          start: map.get(k)!.start,
          end: i + 1,
        });
      } else {
        map.set(k, { start: i, end: i + 1 });
      }
    }
  }

  const result: React.ReactNode[] = [];
  console.log(arr);

  console.log(map);

  for (let i = 0; i < text.length; i++) {
    if (!arr[i]) {
      result.push(text[i]);
    } else {
      const node = arr[i];
      if (!node) {
        throw new Error("Node not found");
      }
      const k = `${node.start}.${node.end}`;
      const recNode = map.get(k);

      if (!recNode) {
        console.log("No recNode");
        throw new Error("No recNode");
      }

      i = recNode.end - 1;

      result.push(
        <span
          key={`${node.start}-${node.end}`}
          className={twMerge(
            node.code === "AGERU" && "text-blue-500",
            node.code === "AGERU_TE" && "text-blue-500",
            node.code === "AIDA" && "text-rose-900",
            node.code === "AMARI" && "text-red-700",
            node.code === "ARU_TE" && "text-cyan-600",
            node.code === "ATODE" && "text-purple-500",
            node.code === "BA" && "text-green-600",
            node.code === "BAKARI" && "text-pink-800",
            node.code === "BA_YOKATTA" && "text-orange-400",
            node.code === "TE_YOKATTA" && "text-orange-400",
            node.code === "DAI" && "text-emerald-500",
            node.code === "DAKE" && "text-sky-600",
            node.code === "DAKE_DE" && "text-red-600",
            node.code === "DAKE_DE_WA_NAKU" && "text-yellow-700",
            node.code === "DAROU/DESYOU" && "text-blue-600",
            node.code === "DAROU_KA/DESYOU_KA" && "text-blue-500",
            node.code === "DASU" && "text-pink-400",
            node.code === "DOROU_GA-DAROU_GA/DOROU_TA-DAROU_TA" &&
              "text-yellow-500",
            node.code === "DOU" && "text-cyan-700",
            node.code === "DOU_KA" && "text-cyan-700",
            node.code === "DOU_NI_KA" && "text-cyan-700",
            node.code === "GARU" && "text-emerald-600",
            node.code === "GORO" && "text-sky-500",
            node.code === "GOTONI" && "text-rose-400",
            node.code === "HAZU" && "text-amber-700",
            node.code === "HAZU_GA_NAI" && "text-blue-600",
            node.code === "HODO" && "text-orange-600",
            node.code === "HOSHII_GA" && "text-purple-500",
            node.code === "HOSHII_TE" && "text-purple-500",
            node.code === "HOU_GA_II" && "text-orange-500",
            node.code === "HOU_GA_YORI" && "text-purple-500",
            node.code === "ICHIBAN" && "text-amber-500",
            node.code === "JIBUN" && "text-orange-900",
            node.code === "KA_DOU_KA" && "text-cyan-700",
            node.code === "KAI" && "text-blue-800",
            node.code === "KAMOSHIRENAI" && "text-emerald-800",
            node.code === "KASHIRA" && "text-rose-800",
            node.code === "KAWARI_NI" && "text-lime-600",
            node.code === "KEREDOMO" && "text-lime-500",
            node.code === "KIKOERU" && "text-sky-500",
            node.code === "KOTO_GA_ARU_1" && "text-green-500",
            node.code === "KOTO_GA_ARU_2" && "text-green-500",
            node.code === "KOTO_GA_DEKIRU" && "text-green-500",
            node.code === "KOTO_NI_NARU" && "text-green-500",
            node.code === "KOTO_NI_SURU" && "text-green-500",
            node.code === "KOTO_NOM" && "text-green-500",
            node.code === "KUDASAI" && "text-rose-400",
            node.code === "KURAI" && "text-emerald-700",
            node.code === "KURERU_TE" && "text-orange-500",
            node.code === "MAE_NI" && "text-orange-600",
            node.code === "MAMA" && "bg-gray-300",
            node.code === "MASHOU" && "text-pink-800",
            node.code === "MASHOU_KA" && "text-pink-600",
            node.code === "MIERU" && "text-blue-500",
            node.code === "MIRU" && "text-amber-700",
            node.code === "MO_MO" && "bg-gray-300",
            node.code === "MONO_DA" && "text-red-500",
            node.code === "NADO" && "text-amber-600",
            node.code === "NAGARA" && "text-rose-500",
            node.code === "NAI_DE" && "text-green-500",
            node.code === "NAKEREBA_NARANAI" && "text-pink-700",
            node.code === "NAKU_NARU" && "text-cyan-600",
            node.code === "NAKUTE" && "text-emerald-700",
            node.code === "NAKUTE_MO" && "text-emerald-700",
            node.code === "NARA" && "text-cyan-700",
            node.code === "NASAI" && "text-cyan-500",
            node.code === "N_DESU" && "text-sky-600",
            node.code === "NIKUI" && "text-cyan-500",
            node.code === "NI_SHITE_WA" && "text-rose-400",
            node.code === "NODE" && "text-purple-600",
            node.code === "NONI" && "text-purple-500",
            node.code === "NONI_REGRET" && "text-purple-500",
            node.code === "OKU" && "text-purple-500",
            node.code === "RASHII" && "text-purple-600",
            node.code === "SASERU" && "text-sky-600",
            node.code === "TAI" && "text-pink-500",
            node.code === "TO_IU" && "text-purple-500",
            node.code === "TOKORO_DA" && "text-pink-600",
            node.code === "TO_OMOU" && "text-sky-500",
            node.code === "DOU_MO" && "text-cyan-700",
            node.code === "MORAU_TE" && "text-cyan-700",
            node.code === "KARA_TE" && "text-lime-600",
            node.code === "KARA" && "text-lime-600",
            node.code === "TO_IU_NO_WA" && "text-blue-600",
            node.code === "TEMO" && "text-blue-600",
            node.code === "TEMO_II" && "text-red-600",
            node.code === "NAKUTE_MO_II" && "text-orange-400",
            node.code === "SHIKA" && "text-emerald-600",
            node.code === "TE_FORM" && "text-red-600",
            node.code === "IRU_TE" && "text-cyan-500",
            node.code === "YOU_NI" && "text-red-600",
            node.code === "YOU_NI_SURU" && "text-sky-600",
            node.code === "YOU_NI_NARU" && "text-sky-600",
            node.code === "YOU_NI_IU" && "text-sky-600",
            node.code === "TARA" && "text-pink-600",
            node.code === "TARA_DOU_DESU_KA" && "text-pink-600",
            node.code === "KURU_TE" && "text-pink-500",
            node.code === "KURU_TE" && "text-pink-500",
            node.code === "TARI_TARI" && "text-pink-500",
            node.code === "ITADAKU" && "text-yellow-600",
            node.code === "DEMO" && "text-green-700",
            node.code === "DEMO_ADP" && "text-green-700",
            node.code === "DAKE_POTENTIAL" && "text-green-700",
            node.code === "MADA" && "text-lime-700",
            node.code === "SHI" && "text-purple-800",
            node.code === "GA" && "text-purple-800",
            node.code === "KARA_DA" && "text-purple-800",
            node.code === "NANTE" && "text-purple-800",
            node.code === "ZUTSU" && "text-cyan-600",
            node.code === "ZUNI" && "text-cyan-700",
            node.code === "_ENDING_NE" && "text-cyan-600",
            node.code === "_ENDING_NA" && "text-cyan-600",
            node.code === "_ENDING_KA" && "text-pink-600",
            node.code === "_ENDING_NO" && "text-pink-600",
            node.code === "_ENDING_ZO" && "text-cyan-600",
            node.code === "_ENDING_ZE" && "text-cyan-600",
            node.code === "_ENDING_YO" && "text-cyan-600",
            node.code === "_ENDING_WA" && "text-cyan-600",
            node.code === "_ENDING_NE_E" && "text-cyan-600",
            node.code === "_ENDING_NA_A" && "text-cyan-600",
            node.code === "_ENDING_WA_A" && "text-cyan-600",
            node.code === "YOU_TO_SURU" && "text-orange-700",
            node.code === "YOU_DA" && "text-orange-700",
            node.code === "YA" && "text-purple-700",
            node.code === "YAHARI/YAPPARI" && "text-orange-700",
            node.code === "SEKKAKU" && "text-amber-600",
            node.code === "WAZAWAZA" && "text-amber-600",
            node.code === "WAKE_DE_WA_NAI" && "text-purple-600",
            node.code === "TSUMORI" && "text-purple-600",
            node.code === "TTE" && "text-amber-600",
            node.code === "TOKA_TOKA" && "text-amber-600",
            node.code === "TOKI" && "text-green-600",
            node.code === "TO_IE_BA" && "text-green-600",
            node.code === "YARU_TE" && "text-pink-700",
            node.code === "WA_IKENAI" && "text-pink-700",
            node.code === "TAMARANAI" && "text-amber-600",
            node.code === "SHIMAU" && "text-emerald-600",
            node.code === "PASSIVE_1GR" && "text-emerald-600",
            node.code === "PASSIVE_OR_POTENTIAL_2GR" && "text-emerald-600",
            node.code === "NO_POSSESIVE" && "text-purple-600",
            node.code === "NO_NOMINALIZER" && "text-rose-600",
            node.code === "SA" && "text-green-600",
            node.code === "CHAU/JAU" && "text-green-600",
            node.code === "TOKORO_IN_THE_MIDDLE" && "text-green-600",
            node.code === "TAMENI" && "text-green-600",
            node.code === "SORE_DE" && "text-purple-600",
            node.code === "SORE_DE_WA" && "text-purple-600",
            node.code === "NI_TSUITE" && "text-purple-600",
            node.code === "WA_DAME_DA" && "text-purple-600",
            getColor(node.code),
          )}
        >
          {text.slice(recNode?.start, recNode?.end)}
        </span>,
      );
    }
  }

  return result;
};

const getColor = (code: Code | undefined) => {
  if (!code) {
    return "yellow";
  }

  const colors: Record<Code, string> = {
    AGERU: "bg-gray-300",
    AGERU_TE: "bg-gray-300",
    AIDA: "bg-gray-300",
    AMARI: "bg-gray-300",
    ARU_TE: "bg-gray-300",
    ATODE: "bg-gray-300",
    BA: "bg-gray-300",
    BAKARI: "bg-gray-300",
    BA_YOKATTA: "bg-gray-300",
    DAI: "bg-gray-300",
    DAKE: "bg-gray-300",
    DAKE_DE: "bg-gray-300",
    DAKE_DE_WA_NAKU: "bg-gray-300",
    "DAROU/DESYOU": "text-blue-600",
    "DAROU_KA/DESYOU_KA": "bg-gray-300",
    DASU: "bg-gray-300",
    "DOROU_GA-DAROU_GA/DOROU_TA-DAROU_TA": "bg-gray-300",
    DOU: "bg-gray-300",
    DOU_KA: "bg-gray-300",
    DOU_NI_KA: "bg-gray-300",
    GARU: "bg-gray-300",
    GORO: "bg-gray-300",
    GOTONI: "bg-gray-300",
    HAZU: "bg-gray-300",
    HAZU_GA_NAI: "bg-gray-300",
    HODO: "text-orange-600",
    HOSHII_GA: "bg-gray-300",
    HOSHII_TE: "bg-gray-300",
    HOU_GA_II: "bg-gray-300",
    HOU_GA_YORI: "bg-gray-300",
    ICHIBAN: "bg-gray-300",
    JIBUN: "bg-gray-300",
    KA_DOU_KA: "bg-gray-300",
    KAI: "bg-gray-300",
    KAMOSHIRENAI: "bg-gray-300",
    KASHIRA: "bg-gray-300",
    KAWARI_NI: "bg-gray-300",
    KEREDOMO: "bg-gray-300",
    KIKOERU: "bg-gray-300",
    KOTO_GA_ARU_1: "text-green-500",
    KOTO_GA_ARU_2: "text-green-500",
    KOTO_GA_DEKIRU: "text-green-500",
    KOTO_NI_NARU: "text-green-500",
    KOTO_NI_SURU: "text-green-500",
    KOTO_NOM: "text-green-500",
    KUDASAI: "bg-gray-300",
    KURAI: "bg-gray-300",
    KURERU_TE: "bg-gray-300",
    MAE_NI: "bg-gray-300",
    MAMA: "bg-gray-300",
    MASHOU: "bg-gray-300",
    MASHOU_KA: "bg-gray-300",
    MIERU: "bg-gray-300",
    MIRU: "bg-gray-300",
    MO_MO: "bg-gray-300",
    MONO_DA: "bg-gray-300",
    NADO: "bg-gray-300",
    NAGARA: "bg-gray-300",
    NAI_DE: "bg-gray-300",
    NAKEREBA_NARANAI: "bg-gray-300",
    NAKU_NARU: "bg-gray-300",
    NAKUTE: "bg-gray-300",
    NAKUTE_MO: "bg-gray-300",
    NARA: "bg-gray-300",
    NASAI: "bg-gray-300",
    N_DESU: "bg-gray-300",
    NIKUI: "bg-gray-300",
    NI_SHITE_WA: "bg-gray-300",
    NODE: "bg-gray-300",
    NONI: "bg-gray-300",
    NONI_REGRET: "bg-gray-300",
    OKU: "text-blue-500",
    RASHII: "bg-gray-300",
    SA: "text-green-600",
    SASERU: "bg-gray-300",
    TAI: "text-purple-500",
    TO_IU: "text-purple-500",
    TOKORO_DA: "text-purple-500",
    TO_OMOU: "text-purple-500",
    DOU_MO: "text-purple-500",
    MORAU_TE: "text-purple-500",
    KARA_TE: "text-purple-500",
    KARA: "text-purple-500",
    TO_IU_NO_WA: "text-purple-500",
    TEMO: "text-purple-500",
    TEMO_II: "text-purple-500",
    NAKUTE_MO_II: "text-purple-500",
    SHIKA: "text-purple-500",
    TE_FORM: "text-purple-500",
    IRU_TE: "text-purple-500",
    YOU_NI: "text-purple-500",
    YOU_NI_SURU: "text-purple-500",
    YOU_NI_NARU: "text-purple-500",
    YOU_NI_IU: "text-purple-500",
    TARA: "text-purple-500",
    TARA_DOU_DESU_KA: "text-purple-500",
    KURU_TE: "text-purple-500",
    TARI_TARI: "text-purple-500",
    ITADAKU: "text-purple-500",
    DEMO: "text-purple-500",
    DEMO_ADP: "text-purple-500",
    DAKE_POTENTIAL: "text-purple-500",
    MADA: "text-purple-500",
    SHI: "text-purple-500",
    GA: "text-purple-500",
    KARA_DA: "text-purple-500",
    NANTE: "text-purple-500",
    ZUTSU: "text-purple-500",
    ZUNI: "text-purple-500",
    _ENDING_KA: "text-cyan-600",
    _ENDING_NE: "text-cyan-600",
    _ENDING_NA: "text-cyan-600",
    _ENDING_NO: "text-cyan-600",
    _ENDING_ZO: "text-cyan-600",
    _ENDING_ZE: "text-cyan-600",
    _ENDING_YO: "text-cyan-600",
    _ENDING_WA: "text-cyan-600",
    _ENDING_NE_E: "text-cyan-600",
    _ENDING_NA_A: "text-cyan-600",
    _ENDING_WA_A: "text-cyan-600",
    YOU_TO_SURU: "text-orange-700",
    YOU_DA: "text-orange-700",
    YA: "text-orange-700",
    "YAHARI/YAPPARI": "text-orange-700",
    SEKKAKU: "text-amber-600",
    WAZAWAZA: "text-amber-600",
    WAKE_DE_WA_NAI: "text-amber-600",
    TSUMORI: "text-amber-600",
    TTE: "text-amber-600",
    TOKA_TOKA: "text-amber-600",
    TOKI: "text-amber-600",
    TO_IE_BA: "text-amber-600",
    YARU_TE: "text-amber-600",
    WA_IKENAI: "text-amber-600",
    TE_YOKATTA: "text-amber-600",
    TAMARANAI: "text-amber-600",
    SHIMAU: "text-emerald-600",
    PASSIVE_1GR: "text-emerald-600",
    PASSIVE_OR_POTENTIAL_2GR: "text-emerald-600",
    NO_POSSESIVE: "text-purple-600",
    NO_NOMINALIZER: "text-rose-600",
    "CHAU/JAU": "text-green-600",
    TOKORO_IN_THE_MIDDLE: "text-green-600",
    TAMENI: "text-green-600",
    SORE_DE: "text-green-600",
    SORE_DE_WA: "text-green-600",
    NI_TSUITE: "text-purple-600",
    WA_DAME_DA: "text-purple-600",
  };

  if (!colors[code]) {
    console.warn(`Unknown code: ${code}`);
  }
  return colors[code] ? "" : "bg-gray-300";
};
