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
  return tmp;
}
