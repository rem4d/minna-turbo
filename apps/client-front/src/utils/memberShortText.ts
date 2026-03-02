export const getMemberShortText = ({
  transLang,
  ru,
  en,
}: {
  transLang: string | null;
  ru: string[] | null;
  en: string[] | null;
}) => {
  let text = transLang === "ru" ? ru : en;

  if (!text || text.length === 0) {
    text = en ?? [];
  }
  return text.join(", ");
};
