import kuromoji from "@sglkc/kuromoji";
import { isKana, isKanji, isKatakana, toHiragana } from "wanakana";
import { KanjiMapped } from "../../types";
import filterList from "./filter.json" with { type: "json" };

type Tokenizer = kuromoji.Tokenizer<kuromoji.IpadicFeatures>;
class Deferred {
  promise: Promise<Tokenizer>;
  resolve!: (value: Tokenizer) => void;
  reject!: (reason: Error) => void;
  constructor() {
    this.promise = new Promise<Tokenizer>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

type FilterRule = {
  kanji: string;
  reading: string[];
  pos?: string;
};

const deferred = new Deferred();
let isLoading = false;

// type Ret = ReturnType<typeof kuromoji.IpadicFormatter>

const getTokenizer = async () => {
  if (isLoading) {
    return await deferred.promise;
  }
  isLoading = true;
  const builder = kuromoji.builder({
    dicPath: "dict",
  });
  builder.build((err, tokenizer) => {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(tokenizer);
    }
  });
  return await deferred.promise;
};

export const tokenize = async (text: string) => {
  const tokenizer = await getTokenizer();

  const _mojiTokens = tokenizer.tokenize(text);
  // console.log(_mojiTokens);
  // console.log(_mojiTokens.filter((t) => t.surface_form === "すごい"));
  // console.log(_mojiTokens);

  const issuesMap = fillMap({
    json: filterList,
    tokens: _mojiTokens,
    text,
  });

  // const possibleIssuesMap = fillMap({
  //   json: possibleFilterList,
  //   tokens: _mojiTokens,
  //   text,
  // });
  //
  // possibleIssuesMap.forEach((wordFilterRule, wordToReplace) => {
  //   if (!issuesMap.get(wordToReplace)) {
  //     console.log(`Possible issue: ${wordToReplace}`);
  //   }
  // });

  let mojiTokens = [..._mojiTokens];

  issuesMap.forEach((wordFilterRule, wordToReplace) => {
    // console.log("Checking issue: ", wordToReplace);
    const arr = Array.from(wordToReplace);
    let arrIndex = 0;
    let tokenIndexesToRemove = [];
    let resultStr = "";

    for (let i = 0; i < mojiTokens.length; i++) {
      if (mojiTokens[i]?.word_type === "REPLACED") {
        continue;
      }
      const mArr = Array.from(mojiTokens[i]?.surface_form ?? "");

      for (let j = 0; j < mArr.length; j++) {
        if (mArr[j] === arr[arrIndex]) {
          // console.log(`Found equal: ${mArr[j]} and ${arr[arrIndex]}`);
          arrIndex++;
          resultStr += mArr[j];

          if (tokenIndexesToRemove.indexOf(i) === -1) {
            tokenIndexesToRemove.push(i);
          }
        } else {
          arrIndex = 0;
          tokenIndexesToRemove = [];
          break;
        }
      }

      if (arrIndex === arr.length) {
        break;
      }
    }

    if (tokenIndexesToRemove.length > 0) {
      const firstIndex = tokenIndexesToRemove[0];
      if (typeof firstIndex === "number") {
        // console.log(`Remove tokens with indexes: `, tokenIndexesToRemove);
        // console.log(`Put new element: `, wordToReplace);
        mojiTokens = mojiTokens.toSpliced(
          firstIndex,
          tokenIndexesToRemove.length,
          {
            word_id: 0,
            word_type: "REPLACED",
            word_position: _mojiTokens[firstIndex]?.word_position ?? 0,
            surface_form: wordToReplace,
            basic_form: wordToReplace,
            pos: wordFilterRule.pos ?? "noun",
            pos_detail_1: "replaced",
            reading: wordFilterRule.reading[0],
            pos_detail_2: "",
            pos_detail_3: "",
            pronunciation: "",
            conjugated_form: "",
            conjugated_type: "",
          },
        );
      }
    }
  });

  // token exceptions; display surface_form instead of basic_form
  const mapBasicForm = (t: kuromoji.IpadicFeatures) => {
    let b = t.basic_form;
    if (mapPos(t.pos) === "auxiliary" && t.surface_form == "なら") {
      b = "なら";
    }
    return b;
  };

  const tokens: KanjiMapped[] = mojiTokens.map((token) => {
    return {
      original: token.surface_form,
      reading: isKatakana(token.surface_form) ? "" : toHiragana(token.reading),
      start: token.word_position - 1,
      end: token.word_position - 1 + token.surface_form.length,
      pos: mapPos(token.pos),
      pos_detail_1: mapPosDetails(token.pos_detail_1),
      basic_form: mapBasicForm(token),
      is_kanji: isKanji(token.surface_form),
      is_kana: isKana(token.surface_form),
    };
  });

  return tokens;
};

const mapPos = (pos: string) => {
  switch (pos) {
    case "助動詞":
      return "auxiliary";
    case "助名":
      return "assistant";
    case "名詞":
      return "noun";
    case "助詞":
      return "particle";
    case "記号":
      return "symbol";
    case "動詞":
      return "verb";
    case "接続詞":
      return "conj";
    case "副詞":
      return "adverb";
    case "連体詞":
      return "conjunction";
    case "形容詞":
      return "adjective";
    case "接頭詞":
      return "prefix";
    case "感動詞":
      return "interjection";
    default:
      return pos;
  }
};
const mapPosDetails = (pos: string) => {
  switch (pos) {
    case "一般":
      return "common";
    case "助数詞":
      return "counterparts";
    case "接尾":
      return "suffix";
    case "代名詞":
      return "pronouns";
    case "自立":
      return "independent";
    case "固有名詞":
      return "proper_noun";
    case "数":
      return "number";
    case "形容動詞語幹":
      return "adj_stem";
    case "ナイ形容詞語幹":
      return "nai_adj_stem";
    case "副詞可能":
      return "adverb_possible";
    case "サ変接続":
      return "sa_change_connection";
    case "助詞類接続":
      return "particle_connection";
    case "非自立":
      return "non_independent";
    case "句点":
      return "full_stop";
    case "格助詞":
      return "case_particles";
    case "動詞非自立的":
      return "verb-non_independent";
    case "特殊":
      return "special";
    case "終助詞":
      return "final_particle";
    case "接続助詞":
      return "conjunctions";
    default:
      return pos;
  }
};

type FillMapProps = {
  json: any;
  tokens: kuromoji.IpadicFeatures[];
  text: string;
};

const fillMap = ({ json, tokens, text }: FillMapProps) => {
  const rulesMap = new Map<string, FilterRule>(
    json.map((filterRule: FilterRule) => [filterRule.kanji, filterRule]),
  );
  const map = new Map<string, FilterRule>();

  rulesMap.forEach((v, k) => {
    if (k.length > 1) {
      const reg = new RegExp(k, "u");
      const found = reg.test(text);

      if (found) {
        const correspondingToken = tokens.find((mt) => mt.surface_form === k);
        const readingsAreDifferent =
          correspondingToken &&
          correspondingToken.reading &&
          v.reading &&
          correspondingToken.reading[0] != v.reading[0];

        if (!correspondingToken || readingsAreDifferent) {
          map.set(k, v);
        }
      }
    }
  });

  return map;
};
