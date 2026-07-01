import { parseLocale } from "./locales";
import { getMessages } from "./messages";
import { createTranslator } from "./translate";

export function getServerT(locale: unknown) {
  return createTranslator(getMessages(parseLocale(locale)));
}
