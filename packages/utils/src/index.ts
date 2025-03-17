export const sleep = async (sec: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, sec * 1000);
  });
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function shuffle<T>(array: T[]) {
  const tmp = [...array];

  for (let i = tmp.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const c = tmp[i];
    // @ts-expect-error noext
    tmp[i] = tmp[j];
    // @ts-expect-error noext
    tmp[j] = c;
  }
  return tmp.slice(0, 20);
}
export * from "./hooks";
