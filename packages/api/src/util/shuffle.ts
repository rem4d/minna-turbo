export function shuffle<T>(array: T[]) {
  const tmp: T[] = [...array];

  for (let i = tmp.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const c = tmp[i];
    if (tmp[i] && tmp[j] && c) {
      tmp[i] = tmp[j];
      tmp[j] = c;
    }
  }
  return tmp;
}
