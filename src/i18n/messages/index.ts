import type { Locale } from "../locales";
import { messages as en } from "./en";
import { messages as id } from "./id";

const catalogs = { id, en } as const;

export function getMessages(locale: Locale) {
  return catalogs[locale];
}

export type { Messages, MessageSchema } from "./id";
