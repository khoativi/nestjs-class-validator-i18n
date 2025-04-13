import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

type Messages = Record<string, string>;

/**
 * Internationalization helper that loads and caches translation messages.
 */
export class I18n {
  private readonly cache = new Map<string, Messages>();

  constructor(private readonly fallback = 'en') {
    // preload fallback once
    const fallbackMessages = this.readMessagesFile(fallback);
    this.cache.set(fallback, fallbackMessages);
  }

  /**
   * Load and cache the messages for a given language.
   * Falls back to the default language if file does not exist.
   * @param lang - Language code (e.g., 'en', 'vi').
   * @returns A record of message templates keyed by constraint name.
   */
  load(lang: string): Messages {
    if (this.cache.has(lang)) return this.cache.get(lang)!;

    const filePath = resolve(__dirname, 'messages', `${lang}.json`);
    if (existsSync(filePath)) {
      const messages = JSON.parse(readFileSync(filePath, 'utf8')) as Messages;
      this.cache.set(lang, messages);
      return messages;
    }

    // fallback safely if lang not found
    return this.cache.get(this.fallback)!;
  }

  /**
   * Translate a constraint key into a localized message template.
   * @param lang - Language code to translate into.
   * @param key - Constraint key identifying which message template to use.
   * @param property - Name of the property being validated.
   * @param constraints - Array of constraint values used to fill template placeholders.
   * @returns A formatted localized validation message.
   */
  translate(
    lang: string,
    key: string,
    property: string,
    constraints: (string | number)[]
  ): string {
    const messages = this.load(lang);
    const template =
      messages[key] || this.cache.get(this.fallback)?.[key] || key;

    return template
      .replace('$property', property)
      .replace(/\$constraint(\d+)/g, (_: string, i: string) =>
        String(constraints[+i - 1])
      );
  }

  private readMessagesFile(lang: string): Messages {
    const filePath = resolve(__dirname, 'messages', `${lang}.json`);
    if (!existsSync(filePath)) return {};
    return JSON.parse(readFileSync(filePath, 'utf8')) as Messages;
  }
}
