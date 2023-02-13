import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache
} from '@apollo/client';
import { MultiAPILink } from '@habx/apollo-multi-endpoint-link';

const apollo = new ApolloClient({
  link: ApolloLink.from([
    new MultiAPILink({
      endpoints: {
        shopify: `https://${process.env.NEXT_PUBLIC_SHOPIFY_SHOP_URL}/api/2023-01/graphql.json`,
        contentful: `https://graphql.contentful.com/content/v1/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}`
      },
      httpSuffix: '',
      getContext: (endpoint) => {
        switch (endpoint) {
          case 'shopify':
            return {
              headers: {
                'X-Shopify-Storefront-Access-Token': process.env
                  .NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_KEY as string
              }
            };
          case 'contentful':
            return {
              headers: {
                Authorization: `Bearer ${
                  process.env.NEXT_PUBLIC_CONTENTFUL_CDN_API as string
                }`
              }
            };
          default:
            return {};
        }
      },
      createHttpLink: () => createHttpLink()
    })
  ]),

  cache: new InMemoryCache()
});

export default apollo;
