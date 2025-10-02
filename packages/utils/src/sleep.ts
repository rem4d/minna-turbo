export const sleep = async (sec: number) => {
  console.info(`Sleep ${sec} sec...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, sec * 1000);
  });
};
