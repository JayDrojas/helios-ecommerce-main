import { LanguageCode } from '@/graphql/shopify';

export default function getLangCode(locale: string) {
  switch (locale) {
    case 'en':
      return LanguageCode.En;
    case 'es':
      return LanguageCode.Es;
    default:
      console.error('Language not defined, defaulting to English.');
      return LanguageCode.En;
  }
}
