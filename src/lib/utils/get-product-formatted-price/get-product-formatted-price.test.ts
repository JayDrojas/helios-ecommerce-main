import getProductFormattedPrice from './get-product-formatted-price';
import { CurrencyCode, ProductDetailedQuery } from '@/graphql/shopify';

const product: NonNullable<
  NonNullable<ProductDetailedQuery['product']>['variants']['nodes'][0]
> = {
  __typename: 'ProductVariant',
  selectedOptions: [
    {
      __typename: 'SelectedOption',
      name: 'Color',
      value: 'Rojo'
    }
  ],
  quantityAvailable: 20,
  id: 'gid://shopify/ProductVariant/43914942644457',
  title: 'Red',
  product: {
    __typename: 'Product',
    title: 'Shirt with Image Variants!'
  },
  availableForSale: true,
  requiresShipping: true,
  weight: 5,
  image: {
    __typename: 'Image',
    id: 'gid://shopify/ProductImage/39394764620009',
    url: 'https://cdn.shopify.com/s/files/1/0666/2435/6585/products/GUEST_df88fbea-b985-4c82-926b-00e1c9bdd473.webp?v=1667596784',
    height: 1000,
    width: 1000,
    altText: null
  },
  price: {
    __typename: 'MoneyV2',
    amount: '10.28',
    currencyCode: CurrencyCode.Usd
  },
  metafields: [null, null, null, null],
  metafield: {
    __typename: 'Metafield',
    key: 'previewMedia',
    value:
      '["gid://shopify/MediaImage/31988856586473","gid://shopify/MediaImage/31988856684777"]',
    references: {
      __typename: 'MetafieldReferenceConnection',
      nodes: [
        {
          __typename: 'MediaImage',
          image: {
            __typename: 'Image',
            id: 'gid://shopify/ImageSource/31992259936489',
            url: 'https://cdn.shopify.com/s/files/1/0666/2435/6585/files/GUEST_df88fbea-b985-4c82-926b-00e1c9bdd473_1200x.webp.jpg?v=1667596743',
            altText: ''
          }
        },
        {
          __typename: 'MediaImage',
          image: {
            __typename: 'Image',
            id: 'gid://shopify/ImageSource/31992260034793',
            url: 'https://cdn.shopify.com/s/files/1/0666/2435/6585/files/GUEST_e98d0418-9a8d-4ca5-b4b0-330ec7a4f9b0_1200x.webp.jpg?v=1667596745',
            altText: ''
          }
        }
      ]
    }
  }
};

describe(getProductFormattedPrice, () => {
  test('Creates price string from Product object', () => {
    const result = getProductFormattedPrice(product);
    const expected = '$10.28';
    expect(result).toBe(expected);
  });
});
