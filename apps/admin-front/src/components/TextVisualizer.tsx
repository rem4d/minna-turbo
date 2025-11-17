import { mergePositions, structureText } from "@/utils/visualizer";
import { twMerge } from "tailwind-merge";

interface GlossInput {
  code: string;
  start: number;
  end: number;
}

export interface ReadingPositionItem {
  kanji: string;
  reading: string;
  start: number;
  end: number;
}

type Variant = "color" | "dash";

interface TextVisualizerProps {
  glosses: GlossInput[];
  onGlossClick?: (code: string) => void;
  readings: ReadingPositionItem[];
  text: string;
  variant?: Variant;
}

type Code = string;

export const TextVisualizer = ({
  glosses,
  readings,
  text,
  variant = "color",
  onGlossClick,
}: TextVisualizerProps) => {
  const readings_ = readings.map((r) => ({ ...r, code: r.reading }));
  // const glosses = [];

  const r = structureText(text, readings_);
  const g = structureText(text, glosses);
  const merged = mergePositions(r, g);
  const spans = renderStructuredText(merged, variant, onGlossClick);

  // console.log(r);
  // console.log(g);
  // console.log(merged);
  //
  return <div className="">{spans}</div>;
};

const Text = ({ t }: { t: string }) => <span>{`${t}`}</span>;

const renderStructuredText = (
  arr: ReturnType<typeof mergePositions>,
  variant: Variant,
  onGlossClick?: (code: string) => void,
) => {
  const result: React.ReactNode[] = [];

  let i = 0;
  for (const { text, gloss, reading } of arr) {
    i++;
    const readingSpan = reading ? (
      <span className="text-sm w-full text-center absolute top-[-16px] whitespace-nowrap">
        {reading.code}
      </span>
    ) : null;

    if (gloss) {
      result.push(
        <div
          key={`g${i}`}
          className={twMerge("inline", getVariantStyle(variant, gloss.code))}
          onClick={() => onGlossClick?.(gloss.code)}
        >
          <div className="inline text-[28px] whitespace-nowrap">
            <span className="relative">
              {readingSpan}
              {reading ? (
                <Text t={text.slice(reading.start, reading.end)} />
              ) : null}
            </span>
            {reading ? (
              <Text t={text.slice(reading.end, gloss.end)} />
            ) : (
              <Text t={text} />
            )}
          </div>
        </div>,
      );
    } else {
      result.push(
        <div
          key={`t${i}`}
          className="inline relative text-[28px] whitespace-nowrap"
        >
          {readingSpan}
          <Text t={text} />
        </div>,
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
    TO_SHITE_WA: "bg-gray-300",
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
    TO_SHITE: "text-purple-600",
    DE_WA_NAI: "text-purple-600",
    BEKI: "text-emerald-600",
    MITAI_DA: "text-emerald-600",
    IKU_AUX: "text-emerald-600",
    KURU_AUX: "text-emerald-600",
    MADE: "text-amber-600",
    MADE_NI: "text-amber-600",
    UCHI_NI: "text-purple-600",
    SOU_DA_HEARSAY: "text-purple-600",
    SOU_DA_SEEMS_LIKE: "text-purple-600",
  };

  if (!colors[code]) {
    console.warn(`Unknown code: ${code}`);
  }
  return colors[code] ? "" : "bg-gray-300";
};

const getVariantStyle = (variant: Variant, code: Code) => {
  if (variant === "dash") {
    return "mx-2 cursor-pointer border-b border-dashed border-black";
  }

  return twMerge(
    code === "AGERU" && "text-blue-500",
    code === "AGERU_TE" && "text-blue-500",
    code === "AIDA" && "text-rose-900",
    code === "AMARI" && "text-red-700",
    code === "ARU_TE" && "text-cyan-600",
    code === "ATODE" && "text-purple-500",
    code === "BA" && "text-green-600",
    code === "BAKARI" && "text-pink-800",
    code === "BA_YOKATTA" && "text-orange-400",
    code === "TE_YOKATTA" && "text-orange-400",
    code === "DAI" && "text-emerald-500",
    code === "DAKE" && "text-sky-600",
    code === "DAKE_DE" && "text-red-600",
    code === "DAKE_DE_WA_NAKU" && "text-yellow-700",
    code === "DAROU/DESYOU" && "text-blue-600",
    code === "DAROU_KA/DESYOU_KA" && "text-blue-500",
    code === "DASU" && "text-pink-400",
    code === "DOROU_GA-DAROU_GA/DOROU_TA-DAROU_TA" && "text-yellow-500",
    code === "DOU" && "text-cyan-700",
    code === "DOU_KA" && "text-cyan-700",
    code === "DOU_NI_KA" && "text-cyan-700",
    code === "GARU" && "text-emerald-600",
    code === "GORO" && "text-sky-500",
    code === "GOTONI" && "text-rose-400",
    code === "HAZU" && "text-amber-700",
    code === "HAZU_GA_NAI" && "text-blue-600",
    code === "HODO" && "text-orange-600",
    code === "HOSHII_GA" && "text-purple-500",
    code === "HOSHII_TE" && "text-purple-500",
    code === "HOU_GA_II" && "text-orange-500",
    code === "HOU_GA_YORI" && "text-purple-500",
    code === "ICHIBAN" && "text-amber-500",
    code === "JIBUN" && "text-orange-900",
    code === "KA_DOU_KA" && "text-cyan-700",
    code === "KAI" && "text-blue-800",
    code === "KAMOSHIRENAI" && "text-emerald-800",
    code === "KASHIRA" && "text-rose-800",
    code === "KAWARI_NI" && "text-lime-600",
    code === "KEREDOMO" && "text-lime-500",
    code === "KIKOERU" && "text-sky-500",
    code === "KOTO_GA_ARU_1" && "text-green-500",
    code === "KOTO_GA_ARU_2" && "text-green-500",
    code === "KOTO_GA_DEKIRU" && "text-green-500",
    code === "KOTO_NI_NARU" && "text-green-500",
    code === "KOTO_NI_SURU" && "text-green-500",
    code === "KOTO_NOM" && "text-green-500",
    code === "KUDASAI" && "text-rose-400",
    code === "KURAI" && "text-emerald-700",
    code === "KURERU_TE" && "text-orange-500",
    code === "MAE_NI" && "text-orange-600",
    code === "MAMA" && "text-blue-600",
    code === "MASHOU" && "text-pink-800",
    code === "MASHOU_KA" && "text-pink-600",
    code === "MIERU" && "text-blue-500",
    code === "MIRU" && "text-amber-700",
    code === "MO_MO" && "bg-gray-300",
    code === "MONO_DA" && "text-red-500",
    code === "NADO" && "text-amber-600",
    code === "NAGARA" && "text-rose-500",
    code === "NAI_DE" && "text-green-500",
    code === "NAKEREBA_NARANAI" && "text-pink-700",
    code === "NAKU_NARU" && "text-cyan-600",
    code === "NAKUTE" && "text-emerald-700",
    code === "NAKUTE_MO" && "text-emerald-700",
    code === "NARA" && "text-cyan-700",
    code === "NASAI" && "text-cyan-500",
    code === "N_DESU" && "text-sky-600",
    code === "NIKUI" && "text-cyan-500",
    code === "NI_SHITE_WA" && "text-rose-400",
    code === "TO_SHITE_WA" && "text-rose-400",
    code === "NODE" && "text-purple-600",
    code === "NONI" && "text-purple-500",
    code === "NONI_REGRET" && "text-purple-500",
    code === "OKU" && "text-purple-500",
    code === "RASHII" && "text-purple-600",
    code === "SASERU" && "text-sky-600",
    code === "TAI" && "text-pink-500",
    code === "TO_IU" && "text-purple-500",
    code === "TOKORO_DA" && "text-pink-600",
    code === "TO_OMOU" && "text-sky-500",
    code === "DOU_MO" && "text-cyan-700",
    code === "MORAU_TE" && "text-cyan-700",
    code === "KARA_TE" && "text-lime-600",
    code === "KARA" && "text-lime-600",
    code === "TO_IU_NO_WA" && "text-blue-600",
    code === "TEMO" && "text-blue-600",
    code === "TEMO_II" && "text-red-600",
    code === "NAKUTE_MO_II" && "text-orange-400",
    code === "SHIKA" && "text-emerald-600",
    code === "TE_FORM" && "text-red-600",
    code === "IRU_TE" && "text-cyan-500",
    code === "YOU_NI" && "text-red-600",
    code === "YOU_NI_SURU" && "text-sky-600",
    code === "YOU_NI_NARU" && "text-sky-600",
    code === "YOU_NI_IU" && "text-sky-600",
    code === "TARA" && "text-pink-600",
    code === "TARA_DOU_DESU_KA" && "text-pink-600",
    code === "KURU_TE" && "text-pink-500",
    code === "KURU_TE" && "text-pink-500",
    code === "TARI_TARI" && "text-pink-500",
    code === "ITADAKU" && "text-yellow-600",
    code === "DEMO" && "text-green-700",
    code === "DEMO_ADP" && "text-green-700",
    code === "DAKE_POTENTIAL" && "text-green-700",
    code === "MADA" && "text-lime-700",
    code === "SHI" && "text-purple-800",
    code === "GA" && "text-purple-800",
    code === "KARA_DA" && "text-purple-800",
    code === "NANTE" && "text-purple-800",
    code === "ZUTSU" && "text-cyan-600",
    code === "ZUNI" && "text-cyan-700",
    code === "_ENDING_NE" && "text-cyan-600",
    code === "_ENDING_NA" && "text-cyan-600",
    code === "_ENDING_KA" && "text-pink-600",
    code === "_ENDING_NO" && "text-pink-600",
    code === "_ENDING_ZO" && "text-cyan-600",
    code === "_ENDING_ZE" && "text-cyan-600",
    code === "_ENDING_YO" && "text-cyan-600",
    code === "_ENDING_WA" && "text-cyan-600",
    code === "_ENDING_NE_E" && "text-cyan-600",
    code === "_ENDING_NA_A" && "text-cyan-600",
    code === "_ENDING_WA_A" && "text-cyan-600",
    code === "YOU_TO_SURU" && "text-orange-700",
    code === "YOU_DA" && "text-orange-700",
    code === "YA" && "text-purple-700",
    code === "YAHARI/YAPPARI" && "text-orange-700",
    code === "SEKKAKU" && "text-amber-600",
    code === "WAZAWAZA" && "text-amber-600",
    code === "WAKE_DE_WA_NAI" && "text-purple-600",
    code === "TSUMORI" && "text-purple-600",
    code === "TTE" && "text-amber-600",
    code === "TOKA_TOKA" && "text-amber-600",
    code === "TOKI" && "text-green-600",
    code === "TO_IE_BA" && "text-green-600",
    code === "YARU_TE" && "text-pink-700",
    code === "WA_IKENAI" && "text-pink-700",
    code === "TAMARANAI" && "text-amber-600",
    code === "SHIMAU" && "text-emerald-600",
    code === "PASSIVE_1GR" && "text-emerald-600",
    code === "PASSIVE_OR_POTENTIAL_2GR" && "text-emerald-600",
    code === "NO_POSSESIVE" && "text-purple-600",
    code === "NO_NOMINALIZER" && "text-rose-600",
    code === "SA" && "text-green-600",
    code === "CHAU/JAU" && "text-green-600",
    code === "TOKORO_IN_THE_MIDDLE" && "text-green-600",
    code === "TAMENI" && "text-green-600",
    code === "SORE_DE" && "text-purple-600",
    code === "SORE_DE_WA" && "text-purple-600",
    code === "NI_TSUITE" && "text-purple-600",
    code === "WA_DAME_DA" && "text-purple-600",
    code === "TO_SHITE" && "text-purple-600",
    code === "DE_WA_NAI" && "text-purple-600",
    code === "BEKI" && "text-emerald-600",
    code === "MITAI_DA" && "text-emerald-600",
    code === "KURU_AUX" && "text-emerald-600",
    code === "IKU_AUX" && "text-emerald-600",
    code === "MADE" && "text-amber-700",
    code === "MADE_NI" && "text-amber-700",
    code === "UCHI_NI" && "text-purple-600",
    code === "SOU_DA_HEARSAY" && "text-purple-600",
    code === "SOU_DA_SEEMS_LIKE" && "text-purple-600",
    getColor(code),
  );
};
