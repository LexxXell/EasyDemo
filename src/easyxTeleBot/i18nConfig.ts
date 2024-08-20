import I18n from 'telegraf-i18n';
import path from 'path';

export const i18n = new I18n({
  directory: path.resolve('tg-bot-locales'),
  defaultLanguage: 'en',
  sessionName: 'session',
  useSession: true,
});
