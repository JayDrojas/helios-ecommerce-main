import type { SelectedOptionInput } from '@/graphql/shopify';

export default function transformOptionsFromInput(
  options: SelectedOptionInput[]
): Record<string, string> {
  return options.reduce<Record<string, string>>((output, option) => {
    const { name, value } = option;
    output[name] = value;
    return output;
  }, {});
}
