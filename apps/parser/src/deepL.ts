import puppeteer, { Browser, Page } from "puppeteer";

let browser: Browser | undefined;

const getBrowser = async () => {
  if (!browser) {
    // Launch the browser and open a new blank page
    const b = await puppeteer.launch({
      // headless: false,
      args: ["--lang=ru-RU,ru"],
    });
    browser = b;
    return b;
  }
  return browser;
};

export const DeepLTranslate = async (searchText: string) => {
  const browser = await getBrowser();

  // "In this kind of place, socks are taken offand left. (i.e., the action is unfinished)",
  const page = await browser.newPage();
  const str = searchText.replace(/ /g, "");

  // set viewport and user agent (just in case for nice viewing)
  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
  );
  let en = "";
  let ru = "";
  try {
    ru = await parseLang(page, "ru", str);
    en = await parseLang(page, "en", str);
  } catch (err) {
    console.log(err);
  }

  await page.close();
  // await browser.close();
  return { en, ru };
};

const parseLang = async (page: Page, lg: "en" | "ru", str: string) => {
  const deepLWaitSelector = ".--l.--r.sentence_highlight";
  const deepLUrl = `https://www.deepl.com/en/translator#ja/${lg}/${encodeURI(str)}`;
  await page.goto(deepLUrl);

  try {
    await page.waitForSelector(deepLWaitSelector);
  } catch (err) {
    console.log(err);
    return {
      ru: "",
      en: "",
    };
  }

  await sleep(0.9);
  // await sleep(1);
  const res = await page.$$eval("d-textarea", (els) =>
    [...els].map((e) => e.innerText),
  );

  const ru = res && res[1] ? res[1] : "";
  return ru.replace(/\n/g, "");
};

const sleep = async (sec: number) => {
  console.info(`Sleep ${sec} sec`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, sec * 1000);
  });
};
