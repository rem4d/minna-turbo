export const convertLevel = (level?: number) => {
  if (typeof level === "undefined" || isNaN(level)) {
    return 1;
  }

  return Math.floor(level / 7 + 1);
};
