import type { ProductDetailedQuery } from '@/graphql/shopify';
import getFormattedCost from '@/lib/utils/get-formatted-cost';

export default function getProductFormattedPrice(
  productVariant: NonNullable<
    NonNullable<ProductDetailedQuery['product']>['variants']['nodes'][0]
  >
): string {
  if (!productVariant) return '';
  const currencyCode = productVariant?.price.currencyCode ?? '';
  const price = Number(productVariant?.price.amount) ?? 0;

  if (!productVariant?.price.currencyCode) return '';
  const cost = getFormattedCost(price, currencyCode);

  return cost;
}
