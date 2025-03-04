export const sleep = async (sec: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, sec * 1000);
  });
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export * from "./hooks";
