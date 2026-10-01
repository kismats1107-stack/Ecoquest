import { en, type Strings } from './en';

export type Locale = 'en';

const locales: Record<Locale, Strings> = { en };

let current: Locale = 'en';

export function setLocale(locale: Locale): void {
  current = locale;
}

/** UI strings for the active locale. */
export function useStrings(): Strings {
  return locales[current];
}

export const strings = (): Strings => locales[current];
