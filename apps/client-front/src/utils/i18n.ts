import i18n from "i18next";
import { initReactI18next } from "react-i18next";

void i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          start_quiz: "Start quiz",
          settings: "Settings",
          show_kana: {
            title: "Show kana",
            desc: "Show kana in card quiz",
          },
          show_translation: {
            title: "Show translation",
            desc: "Show translation in card quiz",
          },
          ftui: {
            spoiler:
              "Hover on a card and press on the line to see the hidden kana or meaning.",
            quiz: "Click on the card to see the meaning. Swipe any direction to see the next one.",
          },
          show_in_quiz: {
            title: "Show in quiz",
            desc: "Disable if you don't want to learn this kanji",
          },
          footer: {
            quiz: "Quiz",
            all_kanji: "All kanji",
          },
          again: "Again",
        },
      },
      ru: {
        translation: {
          start_quiz: "Начать",
          settings: "Настройки",
          show_kana: {
            title: "Показывать кану",
            desc: "Показывать кану в карточке",
          },
          show_translation: {
            title: "Показывать перевод",
            desc: "Показывать перевод в карточке ",
          },
          ftui: {
            spoiler:
              "Если вы скрыли кану или перевод, чтобы их показать, зажмите строку с примером.",
            quiz: "Кликните на карточку, чтобы посмотреть значение. Свайпайте в любом направлении, чтобы открыть следующую.",
          },
          show_in_quiz: {
            title: "Учить",
            desc: "Кандзи будет отображаться в тесте",
          },
          footer: {
            quiz: "Играть",
            all_kanji: "Все кандзи",
          },
          again: "Еще раз",
        },
      },
    },
    lng: "en",
    fallbackLng: "en",
  });

export default i18n;
