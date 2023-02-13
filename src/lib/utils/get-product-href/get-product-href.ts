export function objectIdToShopifyId(objectId: string) {
  return `gid://shopify/ProductVariant/${objectId}`;
}

export default function getProductHref(handle: string, variantId?: string) {
  if (variantId) {
    return `/products/${handle}?variant=${variantId}`;
  }
  return `/products/${handle}`;
}
