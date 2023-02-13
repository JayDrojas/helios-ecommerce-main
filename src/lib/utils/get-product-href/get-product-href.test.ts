import getProductHref, { objectIdToShopifyId } from '.';

describe(getProductHref, () => {
  test('Returns an href to be used as a link to the product.', () => {
    const result = getProductHref('bababooey');
    const expected = '/products/bababooey';
    expect(result).toBe(expected);
  });
  test('Appends Variant ID to search params if provided.', () => {
    const result = getProductHref('bababooey', 'example-gid');
    const expected = '/products/bababooey?variant=example-gid';
    expect(result).toBe(expected);
  });
});

describe(objectIdToShopifyId, () => {
  test('Transforms ObjectID from Algolia to formatted shopify Variant ID', () => {
    const result = objectIdToShopifyId('bababooey');
    const expected = 'gid://shopify/ProductVariant/bababooey';
    expect(result).toBe(expected);
  });
});
