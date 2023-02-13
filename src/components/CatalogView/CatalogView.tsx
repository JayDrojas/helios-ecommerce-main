import {
  CollectionCatalogDocument,
  CollectionCatalogQuery,
  PriceRangeFilter,
  ProductCollectionSortKeys
} from '@/graphql/shopify';
import { NetworkStatus, useQuery } from '@apollo/client';
import {
  Box,
  Button,
  Center,
  Container,
  Fade,
  Flex,
  Heading,
  Select,
  SimpleGrid,
  SlideFade,
  Spacer,
  Spinner
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import SingleProductBlock from '@/components/common/SingleProductBlock';
import CatalogOptionsController from './parts/CatalogOptionsController';
import useCollectionCatalogQueryVariables from './hooks/useCollectionCatalogQueryVariables';
import useLocale from '@/lib/utils/hooks/useLocale';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

const sortingOptions = [
  {
    label: 'Newest',
    value: ProductCollectionSortKeys.Created
  },
  {
    label: 'Price (High to Low)',
    value: ProductCollectionSortKeys.Price
  },
  {
    label: 'Best Selling',
    value: ProductCollectionSortKeys.BestSelling
  }
];

export const priceRangeFilterOptions: {
  label: string;
  value: PriceRangeFilter;
}[] = [
  {
    label: 'All',
    value: { min: 0, max: undefined as unknown as number } // It doesn't like being nulled, or else it asssumes 0 😥
  },
  {
    label: '< $50',
    value: { min: 0, max: 50 }
  },
  {
    label: '$50 - $250',
    value: { min: 50, max: 250 }
  },
  {
    label: '$250 - $500',
    value: { min: 250, max: 500 }
  },
  {
    label: '$500+',
    value: { min: 500, max: undefined as unknown as number } // It doesn't like being nulled, or else it asssumes 0 😥
  }
];

interface Props {
  handle: string;
}

const CatalogView = ({ handle }: Props) => {
  const pageCount = 6;
  const { languageCode } = useLocale();
  const { t } = useTranslation('common');
  const router = useRouter();
  const [currentData, setCurrentData] = useState<CollectionCatalogQuery>();
  const [sortKey, setSortKey] = useState<ProductCollectionSortKeys>(
    ProductCollectionSortKeys.Created
  );
  const [ready, setReady] = useState<boolean>(false);

  const [paginationData, paginationDataDispatch] =
    useCollectionCatalogQueryVariables(
      {
        first: pageCount,
        last: null,
        after: null,
        before: null,
        handle: handle,
        filters: [],
        sortKey: sortKey,
        reverse: true,
        language: languageCode
      },
      pageCount
    );

  const [priceFilterIndex, setPriceFilterIndex] = useState<number>(0);
  const [filters, setFilters] = useState<string[]>([]);

  useEffect(() => {
    paginationDataDispatch({
      type: 'changeFilter',
      payload: {
        filters,
        priceRange: priceRangeFilterOptions[priceFilterIndex].value
      }
    });
  }, [filters, paginationDataDispatch, priceFilterIndex]);

  useEffect(() => {
    paginationDataDispatch({
      type: 'changeSortKey',
      payload: {
        sortkey: sortKey
      }
    });
  }, [paginationDataDispatch, sortKey]);

  const { refetch, networkStatus } = useQuery(CollectionCatalogDocument, {
    variables: paginationData,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (!ready) return;
      setCurrentData(data);
    },
    onError: (error) => {
      console.error(error);
    },
    skip: !ready,
    fetchPolicy: 'no-cache',
    nextFetchPolicy: 'no-cache'
  });

  useEffect(() => {
    if (!ready) return;
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          filters: JSON.stringify(filters),
          priceFilterIndex,
          sortKey
        }
      },
      undefined,
      { shallow: true }
    );
    refetch(paginationData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationData, refetch, languageCode]);

  useEffect(() => {
    setReady(false);
    try {
      try {
        if (typeof router.query.sortKey === 'string') {
          setSortKey(router.query.sortKey as ProductCollectionSortKeys);
        }
      } catch {}
      try {
        if (
          typeof router.query.priceFilterIndex === 'string' &&
          !isNaN(Number(router.query.priceFilterIndex))
        ) {
          setPriceFilterIndex(Number(router.query.priceFilterIndex));
        }
      } catch {}
      try {
        if (typeof router.query.filters === 'string') {
          const parsed = JSON.parse(router.query.filters);
          setFilters(parsed);
        }
      } catch {}
    } finally {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            filters: JSON.stringify(filters),
            priceFilterIndex,
            sortKey
          }
        },
        undefined,
        { shallow: true }
      );
      refetch(paginationData);
      setReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Initialize event listener for history navigation event.
   */
  useEffect(() => {
    router.beforePopState((e) => {
      setReady(false);
      setCurrentData(undefined);
      const url = new URLSearchParams(e.url.replace(/(?<=\?)[\S]*/, ''));
      const searchParams = Object.fromEntries(url.entries());
      try {
        try {
          if (typeof searchParams.sortKey === 'string') {
            setSortKey(searchParams.sortKey as ProductCollectionSortKeys);
          }
        } catch {}
        try {
          if (
            typeof searchParams.priceFilterIndex === 'string' &&
            !isNaN(Number(searchParams.priceFilterIndex))
          ) {
            setPriceFilterIndex(Number(searchParams.priceFilterIndex));
          }
        } catch {}
        try {
          if (typeof searchParams.filters === 'string') {
            const parsed = JSON.parse(searchParams.filters);
            setFilters(parsed);
          }
        } catch {}
      } finally {
        router.replace(
          {
            pathname: router.pathname,
            query: {
              filters: JSON.stringify(filters),
              priceFilterIndex,
              sortKey
            }
          },
          undefined,
          { shallow: true }
        );
        refetch(paginationData);
        setReady(true);
      }
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  return (
    <>
      <Container maxW='container.xl' py={8}>
        <Flex alignItems='center'>
          <Box>
            <Heading size='lg'>
              {currentData?.collection?.title ?? 'Catalog'}
            </Heading>
          </Box>
          <Spacer />
          <Box>
            <SlideFade
              unmountOnExit
              in={!!currentData?.collection?.products}
              offsetX={8}
              offsetY={0}
            >
              <Select
                value={sortKey}
                onChange={(e) =>
                  setSortKey(e.target.value as ProductCollectionSortKeys)
                }
              >
                {sortingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </SlideFade>
          </Box>
        </Flex>
        <Flex py={8} flexDirection={{ base: 'column', md: 'row' }} gap={8}>
          <Box flex='1'>
            <SlideFade
              unmountOnExit
              offsetX={-8}
              offsetY={0}
              in={!!currentData?.collection?.products.filters}
            >
              {currentData?.collection?.products.filters ? (
                <CatalogOptionsController
                  availableFilters={currentData?.collection?.products.filters}
                  filters={filters}
                  setFilters={setFilters}
                  priceRangeFilterOptions={priceRangeFilterOptions}
                  priceFilterIndex={priceFilterIndex}
                  setPriceFilterIndex={setPriceFilterIndex}
                />
              ) : (
                <></>
              )}
            </SlideFade>
          </Box>
          <Box flex='3' position={'relative'}>
            {!(
              networkStatus !== NetworkStatus.setVariables &&
              networkStatus !== NetworkStatus.refetch
            ) ? (
              <Center position={'absolute'} top={'40%'} w={'full'}>
                <Spinner size={'xl'} />
              </Center>
            ) : (
              <></>
            )}
            <Fade
              in={
                ready &&
                networkStatus !== NetworkStatus.setVariables &&
                networkStatus !== NetworkStatus.refetch
              }
            >
              {currentData?.collection?.products.nodes.length ? (
                <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                  {currentData?.collection?.products.nodes.map((product) => (
                    <SingleProductBlock key={product.id} {...product} />
                  ))}
                </SimpleGrid>
              ) : (
                <Heading textAlign={'center'} as={'p'}>
                  {ready &&
                  networkStatus !== NetworkStatus.setVariables &&
                  networkStatus !== NetworkStatus.refetch
                    ? `Nothing found...`
                    : ''}
                </Heading>
              )}
              {ready ? (
                <Flex pt={4}>
                  <Button
                    disabled={
                      !currentData?.collection?.products.pageInfo
                        .hasPreviousPage
                    }
                    onClick={() => {
                      if (
                        !currentData?.collection?.products.pageInfo
                          .startCursor ||
                        !currentData?.collection?.products.pageInfo
                          .hasPreviousPage
                      ) {
                        paginationDataDispatch({ type: 'reset' });
                        return;
                      }
                      paginationDataDispatch({
                        type: 'prevPage',
                        payload: {
                          cursor:
                            currentData.collection.products.pageInfo.startCursor
                        }
                      });
                    }}
                  >
                    {t('catalog-page.buttons.previous')}
                  </Button>
                  <Spacer />

                  <Button
                    disabled={
                      !currentData?.collection?.products.pageInfo.hasNextPage
                    }
                    onClick={() => {
                      if (
                        !currentData?.collection?.products.pageInfo.endCursor ||
                        !currentData?.collection?.products.pageInfo.hasNextPage
                      ) {
                        paginationDataDispatch({ type: 'reset' });
                        return;
                      }
                      paginationDataDispatch({
                        type: 'nextPage',
                        payload: {
                          cursor:
                            currentData.collection.products.pageInfo.endCursor
                        }
                      });
                    }}
                  >
                    {t('catalog-page.buttons.next')}
                  </Button>
                </Flex>
              ) : (
                <></>
              )}
            </Fade>
          </Box>
        </Flex>
      </Container>
    </>
  );
};

export default CatalogView;
