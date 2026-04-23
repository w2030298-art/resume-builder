import { zh, type Locale } from './zh';
import { en } from './en';

const locales: Record<'zh' | 'en', Locale> = { zh, en: en as unknown as Locale };

let currentLocale: 'zh' | 'en' = 'zh';

export function setLocale(locale: 'zh' | 'en') {
  currentLocale = locale;
}

export function getLocale(): 'zh' | 'en' {
  return currentLocale;
}

function tInternal(path: string): string {
  const keys = path.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any = locales[currentLocale];
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return path;
    }
  }
  return typeof result === 'string' ? result : path;
}

export default tInternal;