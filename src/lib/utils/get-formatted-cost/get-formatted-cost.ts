/**
 * Transform price parameters into cost display text.
 * @param amount - Cost of the product, usually the `price.amount` of the `ProductVariant` object
 * @param currencyCode - usually the `price.currencyCode` of the `ProductVariant` object
 * @returns Formatted string for cost display.
 * @example getCurrencyString(12.99, 'USD') // $12.99
 */
export default function getFormattedCost(
  amount: number | string,
  currencyCode: string
): string {
  if (typeof amount === 'string') amount = Number(amount);
  return amount.toLocaleString(undefined, {
    style: 'currency',
    currency: currencyCode
  });
}
