import type { Maybe } from '@/lib/interfaces';
import castColorTheme from '.';

const colorTheme: Maybe<{
  __typename?: 'MetaColorTheme' | undefined;
  backgroundColor: string | null;
  contentColor: string | null;
}> = {
  __typename: 'MetaColorTheme',
  backgroundColor: '#ffffff',
  contentColor: '#abcdef'
};

describe(castColorTheme, () => {
  test('Returns ColorTheme object provided values.', () => {
    expect(castColorTheme(colorTheme)).toEqual({
      backgroundColor: '#ffffff',
      contentColor: '#abcdef'
    });
  });
  test('Returns default colors if nothing is provided', () => {
    expect(castColorTheme(null)).toEqual({
      backgroundColor: '#e5e5e5',
      contentColor: '#000000'
    });
  });
});
