import i18n from "i18next";
import { initReactI18next } from "react-i18next";

void i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          flashcards: "Flashcards",
          flashcards_desc:
            "Increase your level by learning new kanji using flashcards",
          sentences: "Sentences",
          start: "Start",
          sentences_desc:
            "Read and listen to real phrases in Japanese consisting only of the kanji you have learned",
          settings: "Settings",
          home: "Home",
          library: "Library",
          add_to_fav: "Add to favorites",
          remove_from_fav: "Remove from favorites",
          sentence_added: "Sentence added to favorites",
          sentence_removed: "Sentence removed from favorites",
          help: "Help",
          your_level: "Level",
          choose_the_last_kanji: "Select the last kanji you learned",
          the_last_kanji: "The last kanji you learned",
          save: "Save",
          change: "Select",
          repeat_deck: "Repeat deck",
          not_assigned: "Not assigned",
          level: "level",
          new: "New",
          repeat: "Repeat",
          assign_deck: "Assign a deck to repeat in the settings.",
          congrats: "Congratulations!",
          congrats_learned: "You learned 7 new kanji",
          congrats_level: "Now your level is",
          congrats_practice_sentences: "Practice sentences",

          help_modal: {
            a: "Click on the card to see the meaning.",
            b: "Swipe any direction to see the next one.",
          },
          again: "Again",
        },
      },
      ru: {
        translation: {
          flashcards: "Карточки",
          flashcards_desc:
            "Повышайте свой уровень, изучая новые кандзи с помощью карточек",
          sentences: "Фразы",
          sentences_desc:
            "Читайте и слушайте реальные фразы на японском, состоящие только из изученных вами кандзи",
          start: "Начать",
          settings: "Настройки",
          home: "Главная",
          library: "Библиотека",
          add_to_fav: "Добавить в избранное",
          remove_from_fav: "Убрать из избранного",
          sentence_added: "Фраза добавлена в избранное",
          sentence_removed: "Фраза удалена из избранного",
          help: "Помощь",
          your_level: "Ваш уровень",
          choose_the_last_kanji: "Выберите последний изученный кандзи",
          save: "Сохранить",
          the_last_kanji: "Последний выученный кандзи",
          change: "Изменить",
          repeat_deck: "Колода для повторения",
          not_assigned: "Не назначена",
          level: "уровень",
          new: "Новые",
          repeat: "Повторить",
          assign_deck: "Назначьте колоду для повторения в настройках.",
          congrats: "Поздравляем!",
          congrats_learned: "Вы изучили 7 новых кандзи",
          congrats_level: "Ваш уровень повышен до",
          congrats_practice_sentences: "Практиковаться с фразами",

          help_modal: {
            a: "Нажмите на карточку, чтобы увидеть ее значение.",
            b: "Проведите пальцем в любом направлении, чтобы увидеть следующую.",
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
