export {};

describe('Environment Configuration', () => {
  test('NEXT_PUBLIC_CONTENTFUL_CDN_API is provided.', () => {
    const result = process.env.NEXT_PUBLIC_CONTENTFUL_CDN_API;
    expect(result).toBeTruthy;
  });
  test('NEXT_PUBLIC_CONTENTFUL_SPACE_ID is provided.', () => {
    const result = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
    expect(result).toBeTruthy;
  });
  test('NEXT_PUBLIC_SHOPIFY_SHOP_URL is provided.', () => {
    const result = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_URL;
    expect(result).toBeTruthy;
  });
  test('NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_KEY is provided.', () => {
    const result = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_KEY;
    expect(result).toBeTruthy;
  });
  test('SHOPIFY_MULTIPASS_KEY is provided', () => {
    const result = process.env.SHOPIFY_MULTIPASS_KEY;
    expect(result).toBeTruthy;
  });
  test('NEXT_PUBLIC_ALGOLIA_ID is provided', () => {
    const result = process.env.NEXT_PUBLIC_ALGOLIA_ID;
    expect(result).toBeTruthy;
  });
  test('NEXT_PUBLIC_ALGOLIA_SEARCH_KEY is provided', () => {
    const result = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;
    expect(result).toBeTruthy;
  });
  test('NEXT_PUBLIC_MAPBOX_AUTOCOMPLETE_KEY is provided.', () => {
    const result = process.env.NEXT_PUBLIC_MAPBOX_AUTOCOMPLETE_KEY;
    expect(result).toBeTruthy;
  });
});
