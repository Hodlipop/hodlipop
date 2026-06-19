import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

import frMessages from "../../../../data/i18n/fr.json";
import enMessages from "../../../../data/i18n/en.json";

const messages = {
  fr: frMessages,
  en: enMessages,
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: messages[locale],
  };
});
