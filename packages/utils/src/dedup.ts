export const dedup = (arr: number[]) => {
  const tmp: number[] = [];
  arr.forEach((el) => {
    if (!tmp.includes(el)) {
      tmp.push(el);
    }
  });
  return tmp;
};
