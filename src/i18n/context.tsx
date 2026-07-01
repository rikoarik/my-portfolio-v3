"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

import type { Locale } from "./locales";
import { getMessages } from "./messages";
import { createTranslator } from "./translate";

export type TranslateFn = ReturnType<typeof createTranslator>;

type I18nContextValue = {
  locale: Locale;
  t: TranslateFn;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const value = useMemo(() => {
    const messages = getMessages(locale);
    return { locale, t: createTranslator(messages) };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}

export function useT() {
  return useI18n().t;
}
