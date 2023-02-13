import { LanguageCode } from '@/graphql/shopify';
import getLangCode from '.';

describe(getLangCode, () => {
  test('getLangCode', () => {
    expect(getLangCode('en')).toEqual(LanguageCode.En);
  });
  test('getLangCode', () => {
    expect(getLangCode('es')).toEqual(LanguageCode.Es);
  });
  test('getLangCode', () => {
    expect(getLangCode('de')).toEqual(LanguageCode.En);
  });
});
