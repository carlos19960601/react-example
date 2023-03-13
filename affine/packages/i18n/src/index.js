import i18next from "i18next";
import {
  I18nextProvider,
  initReactI18next,
  useTranslation,
} from "react-i18next";
import { LOCALES } from "./resources";

export { I18nextProvider, useTranslation, LOCALES };

const resources = LOCALES.reduce(
  (acc, { tag, res }) => ({ ...acc, [tag]: { translation: res } }),
  {}
);

const fallbackLng = "en";

export const createI18n = () => {
  const i18n = i18next.createInstance();
  i18n.use(initReactI18next).init({
    lng: "en",
    fallbackLng,
    resources,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

  return i18n;
};
