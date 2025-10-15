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
            node.code === "DAI" && "text-emerald-500",
            node.code === "DAKE" && "text-sky-600",
            node.code === "DAKE_DE" && "text-red-600",
            node.code === "DAKE_DE_WA_NAKU" && "text-yellow-700",
            node.code === "DAROU/DESYOU" && "text-blue-600",
            node.code === "DAROU_KA/DESYOU_KA" && "bg-gray-300",
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
            node.code === "HOU_GA_II" && "text-purple-500",
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
            node.code === "NARA" && "text-cyan-700",
            node.code === "NASAI" && "text-cyan-500",
            node.code === "N_DESU" && "text-sky-600",
            node.code === "NIKUI" && "text-cyan-500",
            node.code === "NI_SHITE_WA" && "text-rose-400",
            node.code === "NODE" && "text-purple-600",
            node.code === "NONI" && "text-purple-500",
            node.code === "OKU" && "text-purple-500",
            node.code === "RASHII" && "text-purple-600",
            node.code === "SA" && "bg-gray-300",
            node.code === "SASERU" && "text-pink-600",
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
            node.code === "IRU_TE" && "text-red-600",
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
            node.code === "NAN_DEMO" && "text-green-700",
            node.code === "DAKE_POTENTIAL" && "text-green-700",
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
    NARA: "bg-gray-300",
    NASAI: "bg-gray-300",
    N_DESU: "bg-gray-300",
    NIKUI: "bg-gray-300",
    NI_SHITE_WA: "bg-gray-300",
    NODE: "bg-gray-300",
    NONI: "bg-gray-300",
    OKU: "text-blue-500",
    RASHII: "bg-gray-300",
    SA: "bg-gray-300",
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
    NAN_DEMO: "text-purple-500",
    DAKE_POTENTIAL: "text-purple-500",
  };

  if (!colors[code]) {
    console.warn(`Unknown code: ${code}`);
  }
  return colors[code] ? "" : "bg-gray-300";
};
