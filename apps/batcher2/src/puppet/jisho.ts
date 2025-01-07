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

export const JishoTranslate = async (searchText: string) => {
  const browser = await getBrowser();

  // "In this kind of place, socks are taken offand left. (i.e., the action is unfinished)",
  const page = await browser.newPage();
  const str = searchText.replace(/ /g, "");

  // set viewport and user agent (just in case for nice viewing)
  await page.setViewport({ width: 1366, height: 768 });

  const deepLWaitSelector = ".meaning-definition";

  const url = `https://jisho.org/search/${encodeURI(str)}`;
  await page.goto(url);
  // console.log(deepLUrl);

  try {
    await page.waitForSelector(deepLWaitSelector);

    const res = await page.$eval(
      ".meaning-definition .meaning-meaning",
      (els) => (els as HTMLElement).innerText,
    );
    const arr = res.split(";").slice(0, 2).join(";");

    // await sleep(1);

    // console.log(data);
    await page.close();
    // await browser.close();
    return { en: arr };
  } catch (err) {
    console.log(err);
    return {
      en: "",
    };
  }
};

const sleep = async (sec: number) => {
  console.info(`Sleep ${sec} sec`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, sec * 1000);
  });
};
