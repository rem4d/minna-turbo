// python ported

/*
import jaconv from "jaconv";
import { is_hiragana, is_kanji, is_katakaka } from "./utils/rec_chars";

function findNthOccurrence(
  mainString: string,
  subString: string,
  n: number,
): number {
  if (n <= 0) {
    return -1; // Invalid occurrence number
  }

  let startIndex = 0;
  let occurrenceCount = 0;

  while (true) {
    // Find the next occurrence starting from startIndex
    const foundIndex = mainString.indexOf(subString, startIndex);

    if (foundIndex === -1) {
      // Substring not found, or no more occurrences
      return -1;
    }

    occurrenceCount += 1;

    if (occurrenceCount === n) {
      // Nth occurrence found
      return foundIndex;
    } else {
      // Continue searching after the current occurrence
      startIndex = foundIndex + 1;
    }
  }
}

function smallToLargeKana(text: string): string {
  text = text.replace(/っ/g, "つ");
  text = text.replace(/ゅ/g, "ゆ");
  text = text.replace(/ょ/g, "よ");
  text = text.replace(/ゃ/g, "や");
  return text;
}

function checkException(text: string): string | null {
  if (text === "一ヶ月") {
    return "<ruby>一ヶ月<rt>いっかげつ</rt></ruby>";
  }
  return null;
}

function toRuby(text: string, reading: string, readingOffset = 1): string {
  console.debug("toRuby:", text, reading, readingOffset);

  const exception = checkException(text);

  if (exception !== null) {
    return exception;
  }

  if (readingOffset > 5) {
    if (text === "色々") {
      console.log(text.charCodeAt(0));
      console.log(text.charCodeAt(1));
    }
    throw new Error(`Reading offset too high: ${text}, ${reading}`);
  }

  const kanjiArr = Array.from(text).map((char) => is_kanji(char));
  const hasKanji = kanjiArr.some(Boolean);

  if (!hasKanji) {
    return text;
  }

  if (kanjiArr.reduce((a, b) => a + (b ? 1 : 0), 0) === text.length) {
    return `<ruby>${text}<rt>${reading}</rt></ruby>`;
  }

  const origReading = reading;
  let result = "";
  let currentKanji = "";
  let usedRt = "";
  let usedKanji = "";
  let i = 0;

  for (const char of text) {
    i += 1;

    if (is_kanji(char)) {
      currentKanji += char;

      if (i === text.length) {
        const index = text.indexOf(char);
        result += `<ruby>${currentKanji}<rt>${reading}</rt></ruby>`;
        usedRt += reading;
        usedKanji += currentKanji;
      }
    } else if (is_hiragana(char) || is_katakaka(char)) {
      if (currentKanji !== "") {
        const charToFind = jaconv.kata2hira(char);
        let index = findNthOccurrence(reading, charToFind, readingOffset);

        if (index === 0) {
          index = findNthOccurrence(reading, charToFind, readingOffset + 1);
        }

        if (index === -1) {
          const index2 = findNthOccurrence(
            smallToLargeKana(reading),
            charToFind,
            readingOffset,
          );
          if (index2 === -1) {
            throw new Error(
              `Character ${char} not found in reading. text: ${text}, reading: ${reading}`,
            );
          } else {
            index = index2;
          }
        }

        const slicedReading = reading.slice(0, index);
        result += `<ruby>${currentKanji}<rt>${slicedReading}</rt></ruby>${char}`;
        currentKanji = "";
        reading = reading.slice(index + 1);
        usedRt += slicedReading;
        usedKanji += currentKanji;
      } else {
        result += char;
        reading = reading.slice(1);
      }
    } else {
      result += char;
    }
  }

  if (text.length === currentKanji.length) {
    return `<ruby>${text}<rt>${reading}</rt></ruby>`;
  }

  if (reading.length > (usedRt + usedKanji).length) {
    return toRuby(text, origReading, readingOffset + 1);
  }

  return result;
}

if (require.main === module) {
  const text = "お先に失礼します";
  const reading = "おさきにしつれいします";

  console.log(toRuby(text, reading));
}
*/
