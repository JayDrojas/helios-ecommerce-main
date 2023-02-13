import type { Maybe } from '@/lib/interfaces';

interface ColorTheme {
  backgroundColor: string;
  contentColor: string;
}

export default function castColorTheme(
  colorTheme: Maybe<{
    __typename?: 'MetaColorTheme' | undefined;
    backgroundColor: string | null;
    contentColor: string | null;
  }>
): ColorTheme {
  return {
    backgroundColor: colorTheme?.backgroundColor ?? '#e5e5e5',
    contentColor: colorTheme?.contentColor ?? '#000000'
  };
}
