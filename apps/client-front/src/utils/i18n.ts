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
          level_uppercase: "Level",
          new: "New",
          repeat: "Repeat",
          assign_deck: "Assign a deck to repeat in the settings.",
          congrats: "Congratulations!",
          congrats_learned: "You learned 7 new kanji",
          congrats_level: "Now your level is",
          congrats_practice_sentences: "Practice sentences",
          translation: "Translation",
          glossary: "Glossary",
          kanji: "Kanji",
          kanji_in_this_sentence: "Kanji in this sentence",
          recommended_vocabulary: "Recommended vocabulary",
          see_all: "See all",
          all_kanji: "All kanji",
          find: "Search...",
          dictionary: "Dictionary",
          dict_level: "Level {{val, number}} dictonary",
          fav_sentences: "Favourites",
          translation_language: "Translation language",
          choose_translation_language: "Select translation language",
          help_sentences_modal: `
<title> Welcome tutorial </title>

Imagine you have bought a book on learning kanji. It doesn't matter which one, they are all built the same way - you learn the kanji in order and learn new words with those kanji in them. <br /><br />

This section has a similar system, except that here you are offered not words, but sentences. These are sentences that you can encounter in real life. <br /><br />


<title> How is everything organized? </title>

Kanji need to be learned in the order in which they are listed in the app. You can see a detailed list of all kanji in the "Library" section.
<br /> <br />

The level is your position in the kanji sequence. The more kanji you know, the higher your level and the more complex sentences are formed. You may come across sentences that include kanji you don't already know, but don't worry, readings for them will be automatically added on top of the furigana.
<br /> <br />

You can change the level at any time, this app doesn't provide any tracking of your progress or curriculum.
<br /> <br />

In the "Flashcards" section, you can learn and repeat kanji. And then come back here and practice new sentences with the newly learned kanji.
`,
          word_zero: "words",
          word_one: "word",
          word_two: "words",
          word_few: "words",
          word_many: "words",
          word_other: "words",

          help_modal: {
            a: "Click on the card to see the meaning.",
            b: "Swipe any direction to see the next one.",
          },
          again: "Again",
          no_sentences_title: `You've seen everything!`,
          no_sentences_desc: `You  may know very few kanji, so there's not many sentences could be made up.
Please select more kanji in settings to see more sentences. Or you could reset cache using below button`,
          reset_cache: "Reset cache",
          ai_review: "AI review",
          cancel: "Cancel",
          search_no_results: "No results",
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
          choose_the_last_kanji: "Выберите последний выученный кандзи",
          save: "Сохранить",
          the_last_kanji: "Последний выученный кандзи",
          change: "Изменить",
          repeat_deck: "Колода для повторения",
          not_assigned: "Не назначена",
          level: "уровень",
          level_uppercase: "Уровень",
          new: "Новые",
          repeat: "Повторить",
          assign_deck: "Назначьте колоду для повторения в настройках.",
          congrats: "Поздравляем!",
          congrats_learned: "Вы изучили 7 новых кандзи",
          congrats_level: "Ваш уровень повышен до",
          congrats_practice_sentences: "Практиковаться с фразами",
          translation: "Перевод",
          glossary: "Словарь",
          kanji_in_this_sentence: "Кандзи в этой фразе",
          kanji: "Кандзи",
          recommended_vocabulary: "Рекомендованные словари",
          see_all: "Смотреть все",
          all_kanji: "Все кандзи",
          find: "Поиск...",
          dictionary: "Словарь",
          dict_level: "Словарь {{val}} уровня",
          fav_sentences: "Избранные фразы",
          translation_language: "Язык перевода",
          choose_translation_language: "Выберите язык перевода",
          help_sentences_modal: `
<title> Добро пожаловать в <br /> раздел изучения фраз! </title>

Представьте, что вы купили книгу по изучению кандзи. Не имеет значения какую именно, все они построены  одинаково - вы изучаете по порядку кандзи и изучаете новые слова, в составе которых эти кандзи присутствуют.
<br /><br />


Данный раздел имеет похожую систему, за исключением того, что здесь вам предлагаются не слова, а фразы. Эти фразы вы  можете встретить в реальной жизни. <br /><br />

<title> Как все устроено? </title>

Кандзи необходимо изучать в том порядке, в котором они приведены в приложении. Подробный список всех кандзи вы можете посмотреть в разделе "Библиотека".
<br /><br />

Уровень - это ваша позиция в последовательности кандзи. Чем больше кандзи вы знаете, тем выше ваш уровень и тем сложнее фразы формируются. Вам могут попадаться фразы, включающие кандзи, которые вы еще не знаете, но не переживайте, чтения для них будут автоматически добавлены сверху фуриганой.
<br /><br />

Поменять уровень вы можете в любой момент, это приложение не предусматривает какой-либо трекинг вашего прогресса или учебный план.
<br /><br />

В разделе "Карточки" вы можете изучать и повторять кандзи. А потом возвращаться сюда и практиковать новые фразы с новыми изученными кандзи.
`,
          word_zero: "слов",
          word_one: "слово",
          word_two: "слова",
          word_few: "слова",
          word_many: "слов",
          word_other: "слов",
          help_modal: {
            a: "Нажмите на карточку, чтобы увидеть ее значение.",
            b: "Проведите пальцем в любом направлении, чтобы увидеть следующую.",
          },
          again: "Еще раз",

          no_sentences_title: "Фразы закончились!",
          no_sentences_desc:
            "Возможно, пока вы знаете очень мало кандзи, поэтому не так много существует фраз, которые можно составить. Пожалуйста выберите больше кандзи в настройках, чтобы увидеть больше фраз. Либо сбросьте кэш, нажав на кнопку ниже.",
          reset_cache: "Сбросить кэш",
          ai_review: "AI разбор",
          cancel: "Отмена",
          search_no_results: "Ничего не найдено",
        },
      },
    },
    lng: "en",
    fallbackLng: "en",
  });

export default i18n;
