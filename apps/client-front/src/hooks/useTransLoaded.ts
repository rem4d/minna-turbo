import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// @TODO: detect lang

export const useTransLoaded = () => {
  const [hasLoadedTrans, setHasLoadedTrans] = useState(false);

  const { i18n } = useTranslation();
  const userLang = "en";

  useEffect(() => {
    const checkLang = async () => {
      // @ts-expect-error
      if (userLang === "ru") {
        await i18n.changeLanguage(userLang);
      }
      setHasLoadedTrans(true);
    };

    void checkLang();
  }, [userLang, i18n]);

  return hasLoadedTrans;
};
