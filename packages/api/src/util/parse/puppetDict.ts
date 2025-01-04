/*
import puppeteer, { Browser } from "puppeteer";
import { sleep } from "../sleep";

let browser: Browser | undefined;

const getBrowser = async () => {
  if (!browser) {
    // Launch the browser and open a new blank page
    const b = await puppeteer.launch({
      // args: ["--accept-lang=ru", "--lang=ru"],
      // headless: false,
      args: ["--lang=ru-RU,ru"],
    });
    browser = b;
    return b;
  }
  return browser;
};

export const DeepLDictionary = async (searchText: string) => {
  // return { en: [searchText] };
  const browser = await getBrowser();

  // "In this kind of place, socks are taken offand left. (i.e., the action is unfinished)",
  const page = await browser.newPage();
  const str = searchText.replace(/ /g, "");

  // set viewport and user agent (just in case for nice viewing)
  await page.setViewport({ width: 1366, height: 768 });

  const deepLWaitSelector = ".--l.--r.sentence_highlight";
  const deepLUrl = `https://www.deepl.com/en/translator#ja/en-us/${encodeURI(str)}`;
  // const deepLUrl =
  //   "https://www.deepl.com/en/translator#ja/en-us/%E8%A6%8B%E3%81%9B%E3%82%8B";
  await page.goto(deepLUrl);
  // console.log(deepLUrl);

  try {
    await page.waitForSelector(deepLWaitSelector);
    await page.click(deepLWaitSelector);
    // await sleep(20);

    const dictionarySelector =
      '[data-testid="translator-dict-content"] .lemma_content';
    await page.waitForSelector(dictionarySelector);

    const res = await page.$$eval(
      ".translation_lines .featured .translation_desc .dictLink",
      (els) => [...els].map((e) => (e as HTMLHeadingElement).innerText),
    );

    await sleep(1);

    // console.log(data);
    await page.close();
    return { en: res };
  } catch (err) {
    console.log(err);
    return {
      en: [],
    };
  }
};
*/

export const DeepLDictionary = async (searchText: string) => {
  return {
    en: [],
  };
};
