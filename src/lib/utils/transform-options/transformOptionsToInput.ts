import type { SelectedOptionInput } from '@/graphql/shopify';

export default function transformOptionsToInput(options: {
  [key: string]: string;
}): SelectedOptionInput[] {
  const output: SelectedOptionInput[] = [];
  for (const optionName in options) {
    const optionValue = options[optionName];
    output.push({
      name: optionName,
      value: optionValue
    });
  }
  return output;
}
