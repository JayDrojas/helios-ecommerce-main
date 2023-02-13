import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import { Fragment, useEffect, useState } from 'react';
import useLocale from '@/lib/utils/hooks/useLocale';
import { useRouter } from 'next/router';
import {
  Button,
  Container,
  Fade,
  Flex,
  Heading,
  SimpleGrid,
  Text
} from '@chakra-ui/react';
import algoliaClient from '@/lib/clients/algolia';
import useSWR from 'swr';
import SingleProductBlock from '@/components/common/SingleProductBlock';
import { CurrencyCode } from '@/graphql/shopify';
import type { AlgoliaSearchResults } from '@/lib/interfaces/algolia-types';
import { objectIdToShopifyId } from '@/lib/utils/get-product-href';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  try {
    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'en', ['common']))
      }
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
};

const Catalog = () => {
  const { t } = useTranslation('common');
  const [pageNumber, setPageNumber] = useState(0);
  const { languageCode } = useLocale();
  let {
    query: { q }
  } = useRouter();

  if (typeof q !== 'string') q = '';

  const { data, error, isLoading, mutate } = useSWR<AlgoliaSearchResults>(
    q,
    async (q: string) => {
      const result = await algoliaClient.search([
        {
          indexName: 'shopify_products',
          query: q,
          params: { typoTolerance: 'min', hitsPerPage: 8, page: pageNumber }
        }
      ]);
      return result as AlgoliaSearchResults;
    }
  );

  useEffect(() => {
    mutate();
  }, [pageNumber]);

  useEffect(() => {
    if (data && data.results[0].page >= data.results[0].nbPages)
      setPageNumber(0);
  }, [data]);

  if (error) console.error(error);

  const Buttons = () =>
    data?.results[0].hits.length ? (
      <Container maxW={'md'}>
        <Flex justifyContent='space-between' alignItems='center' w='full'>
          <Button
            disabled={data && data.results[0].page <= 0}
            onClick={() => setPageNumber((pageNumber) => pageNumber - 1)}
          >
            Prev
          </Button>
          <Heading as='h3' size='md' my={0}>
            Page {data.results[0].page + 1} of {data.results[0].nbPages}
          </Heading>
          <Button
            disabled={data && data.results[0].nbPages <= pageNumber + 1}
            onClick={() => setPageNumber((pageNumber) => pageNumber + 1)}
          >
            Next
          </Button>
        </Flex>
      </Container>
    ) : (
      <></>
    );
  return (
    <>
      <Head>
        <title>{t('search')}</title>
      </Head>
      <Fragment key={languageCode + q}>
        <Container maxW='container.xl' p={8} mb={8}>
          <Fade in={!isLoading} unmountOnExit>
            <Heading mb={8}>Search results for &quot;{q}&quot;</Heading>
            {data?.results[0].hits.length ? (
              <>
                <Buttons />
                <SimpleGrid columns={[1, 2, 3, 4]} spacing={4} m='auto' my={8}>
                  {data.results[0].hits.map((product) => {
                    return (
                      <SingleProductBlock
                        key={product.objectID}
                        featuredImage={{ url: product.image, id: null }}
                        handle={product.handle}
                        metafield={null}
                        id={''} // TypeScript needs a string here.
                        onlineStoreUrl=''
                        priceRange={{
                          minVariantPrice: {
                            amount: product.variants_min_price,
                            currencyCode: CurrencyCode.Usd
                          },
                          maxVariantPrice: {
                            amount: product.variants_max_price
                          }
                        }}
                        title={product.title}
                        variantTitle={product.variant_title}
                        variantId={objectIdToShopifyId(product.objectID)}
                      />
                    );
                  })}
                </SimpleGrid>
                <Buttons />
              </>
            ) : (
              <Text>Unable to find any products...</Text>
            )}
          </Fade>
        </Container>
      </Fragment>
    </>
  );
};

export default Catalog;
