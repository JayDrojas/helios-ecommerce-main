import { PageDocument } from '@/graphql/contentful';
import {
  CollectionMinimalDocument,
  CollectionMinimalQuery,
  ProductMinimalDocument,
  ProductMinimalQuery
} from '@/graphql/shopify';
import apollo from 'src/lib/clients/apollo';
import getLangCode from '../utils/get-lang-code';

export interface ShopifyDataMinimal {
  products: {
    [key: string]: ProductMinimalQuery['product'];
  };
  collections: {
    [key: string]: CollectionMinimalQuery['collection'];
  };
}

const getPageData = async (slug: string, locale: string) => {
  const shopifyData: ShopifyDataMinimal = {
    products: {},
    collections: {}
  };

  const { data, error } = await apollo.query({
    query: PageDocument,
    variables: { slug, locale },
    fetchPolicy: 'no-cache'
  });

  const content = data?.pageCollection?.items[0];

  if (error) throw new Error(error.message);
  if (!content?.sectionsCollection) throw new Error('unable ot find page.');

  for (let i = 0; i < content.sectionsCollection.items.length; i++) {
    const section = content.sectionsCollection.items[i];
    if (!section) continue;
    const { __typename } = section;

    if (__typename === 'SectionCollectionShowcase') {
      const { shopifyCollection } = section;
      if (!shopifyCollection) continue;
      const { data, error } = await apollo.query({
        query: CollectionMinimalDocument,
        variables: { id: shopifyCollection, language: getLangCode(locale) },
        fetchPolicy: 'no-cache'
      });
      if (error) throw error;
      shopifyData.collections[shopifyCollection] = data.collection;

      continue;
    }

    if (
      __typename === 'SectionDetailedProductShowcase' ||
      __typename === 'SectionProductShowcase'
    ) {
      const { product } = section;
      if (!product) continue;
      const { data, error } = await apollo.query({
        query: ProductMinimalDocument,
        variables: { id: product, language: getLangCode(locale) },
        fetchPolicy: 'no-cache'
      });
      if (error) throw error;
      shopifyData.products[product] = data.product;
      continue;
    }
  }

  return {
    content,
    shopifyData
  };
};

export default getPageData;
