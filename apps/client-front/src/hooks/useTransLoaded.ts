import { useEffect, useState } from "react";
import { userLanguage } from "@/utils/tgUtils";
import { useTranslation } from "react-i18next";

export const useTransLoaded = () => {
  const [hasLoadedTrans, setHasLoadedTrans] = useState(false);

  const { i18n } = useTranslation();
  const userLang = userLanguage() === "ru" ? "ru" : "en";

  useEffect(() => {
    const checkLang = async () => {
      if (userLang == "ru") {
        await i18n.changeLanguage(userLang);
      }
      setHasLoadedTrans(true);
    };

    void checkLang();
  }, [userLang, i18n]);

  return hasLoadedTrans;
};
