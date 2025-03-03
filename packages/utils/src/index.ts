export const sleep = async (sec: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, sec * 1000);
  });
};

export * from "./hooks";
