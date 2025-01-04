export function shuffle<T>(array: T[]) {
  const tmp = [...array] as T[];

  for (let i = tmp.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const c = tmp[i];
    tmp[i] = tmp[j];
    tmp[j] = c;
  }
  return tmp;
}
