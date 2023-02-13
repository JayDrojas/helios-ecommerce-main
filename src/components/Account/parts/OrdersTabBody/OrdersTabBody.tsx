import {
  GetCustomerWithOrdersDocument,
  GetCustomerWithOrdersQuery
} from '@/graphql/shopify';
import {
  VStack,
  Link,
  Heading,
  Text,
  Flex,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  AspectRatio,
  Image,
  Stack,
  Divider,
  Select,
  Button,
  Center,
  Spinner,
  SlideFade
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import getProductHref from '@/lib/utils/get-product-href';
import getFormattedCost from '@/lib/utils/get-formatted-cost';
import useLocale from '@/lib/utils/hooks/useLocale';
import { CheckCircleIcon, InfoIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import getFormattedDate from '@/lib/utils/get-formatted-date';
import { NetworkStatus, useQuery } from '@apollo/client';
import useOrdersQueryVariables from '../../hooks/useOrdersQueryVariables';
import { useShopifyAuth } from '@/components/ShopifyAuth/context/ShopifyAuthContext';

const OrdersTabBody = () => {
  const integerOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const { languageCode } = useLocale();
  const { t } = useTranslation('common');
  const { accessToken } = useShopifyAuth();
  const [user, setCurrentUser] =
    useState<GetCustomerWithOrdersQuery['customer']>();
  const pageCount = 5;

  const [paginationData, paginationDataDispatch] = useOrdersQueryVariables(
    {
      first: pageCount,
      last: null,
      after: null,
      before: null,
      accessToken: accessToken?.accessToken ? accessToken.accessToken : ''
    },
    pageCount
  );

  const { refetch, networkStatus } = useQuery(GetCustomerWithOrdersDocument, {
    variables: paginationData,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data.customer) setCurrentUser(data.customer);
    },
    onError: (error) => {
      console.error(error);
    },
    fetchPolicy: 'no-cache',
    nextFetchPolicy: 'no-cache'
  });

  useEffect(() => {
    refetch(paginationData);
  }, [paginationData, refetch]);

  return (
    <>
      {networkStatus !== NetworkStatus.loading && user ? (
        <SlideFade offsetY='20px' in={user ? true : false}>
          <Accordion
            height='fit-content'
            allowMultiple
            defaultIndex={[0]}
            variant='custom'
          >
            {user?.orders ? (
              <>
                {user.orders.nodes.map((order) => {
                  return (
                    <AccordionItem key={order.id}>
                      {({ isExpanded }) => (
                        <>
                          <AccordionButton _expanded={{ bg: 'gray.50' }}>
                            <Flex
                              flex='1'
                              textAlign='left'
                              p={2}
                              height={isExpanded ? '80px' : '50px'}
                              fontWeight={!isExpanded ? 'bold' : 'normal'}
                            >
                              {isExpanded ? (
                                <Flex gap={4} fontSize='sm' lineHeight='normal'>
                                  <Flex flexDirection='column' gap={2} flex={1}>
                                    <Text color='brand-primary.400'>
                                      {t('account-page.orders-tab.labels.date')}
                                    </Text>
                                    <Text fontWeight='bold'>
                                      {getFormattedDate(
                                        order.processedAt,
                                        languageCode
                                      )}
                                    </Text>
                                  </Flex>
                                  <Flex flexDirection='column' gap={2}>
                                    <Text color='brand-primary.400'>
                                      {t(
                                        'account-page.orders-tab.labels.total'
                                      )}
                                    </Text>
                                    {getFormattedCost(
                                      order.totalPrice.amount,
                                      order.totalPrice.currencyCode
                                    )}
                                  </Flex>
                                  <Flex flexDirection='column' gap={2} flex={1}>
                                    <Text color='brand-primary.400'>
                                      {t(
                                        'account-page.orders-tab.labels.order-number'
                                      )}
                                    </Text>
                                    {order.orderNumber}
                                  </Flex>
                                </Flex>
                              ) : (
                                getFormattedDate(
                                  order.processedAt,
                                  languageCode
                                )
                              )}
                            </Flex>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel pb={4}>
                            <Flex
                              flexDirection={{
                                lg: 'row',
                                md: 'row',
                                sm: 'column',
                                base: 'column'
                              }}
                              h='full'
                            >
                              <Stack flex='5' p={8}>
                                {order.lineItems.nodes.map((item, idx) => (
                                  <Box key={`${item.variant?.title} + ${idx}`}>
                                    <Flex
                                      direction={['column', 'row']}
                                      p={2}
                                      gap={4}
                                    >
                                      <AspectRatio ratio={1 / 1} flex={1.1}>
                                        <Image
                                          loading='lazy'
                                          objectFit='scale-down'
                                          src={item.variant?.image?.url}
                                          alt={
                                            item.variant?.image?.altText
                                              ? item.variant?.image?.altText
                                              : ''
                                          }
                                        />
                                      </AspectRatio>
                                      <Flex direction='column' gap={1} flex={3}>
                                        <NextLink
                                          href={getProductHref(
                                            item.variant?.product.handle
                                              ? item.variant?.product.handle
                                              : '/'
                                          )}
                                          passHref
                                          legacyBehavior
                                        >
                                          <Link w='full'>
                                            <Heading size='sm' as='h3' w='80%'>
                                              {item.title}
                                            </Heading>
                                          </Link>
                                        </NextLink>

                                        <Box mb={2}>
                                          <Text fontSize='sm'>
                                            {item.variant?.title !==
                                            'Default Title'
                                              ? item.variant?.title
                                              : ''}
                                          </Text>
                                        </Box>
                                        <Box display='flex' gap={10}>
                                          <Select
                                            value={item.quantity}
                                            maxW={20}
                                            disabled={true}
                                          >
                                            {integerOptions.map((number) => (
                                              <option
                                                key={number}
                                                value={number}
                                                disabled={
                                                  Number(number) >
                                                  (item.variant
                                                    ?.quantityAvailable ?? 0)
                                                }
                                              >
                                                {number}
                                              </option>
                                            ))}
                                          </Select>
                                          <Text
                                            fontSize='md'
                                            color='brand-primary.500'
                                            lineHeight={10}
                                          >
                                            {getFormattedCost(
                                              item.variant?.price.amount,
                                              item.variant?.price.currencyCode
                                                ? item.variant?.price
                                                    .currencyCode
                                                : ''
                                            )}
                                          </Text>
                                        </Box>
                                      </Flex>
                                    </Flex>
                                    <Divider />
                                  </Box>
                                ))}
                              </Stack>
                              {[
                                'PARTIALLY_FULFILLED',
                                'FULFILLED',
                                'IN_PROGRESS'
                              ].includes(order.fulfillmentStatus) ? (
                                <VStack
                                  p={5}
                                  gap={2}
                                  w={['full', null, '300px']}
                                >
                                  <Button
                                    as={NextLink}
                                    href={order.statusUrl}
                                    w='full'
                                    h='52px'
                                    colorScheme='brand-primary'
                                  >
                                    {t(
                                      'account-page.orders-tab.labels.track-package'
                                    )}
                                  </Button>
                                  <Center>
                                    <Text color='brand-primary.500'>
                                      {order.fulfillmentStatus ===
                                      'FULFILLED' ? (
                                        <>
                                          <CheckCircleIcon />{' '}
                                        </>
                                      ) : (
                                        ''
                                      )}
                                      {t(
                                        `account-page.orders-tab.labels.${order.fulfillmentStatus}`
                                      )}
                                    </Text>
                                  </Center>
                                </VStack>
                              ) : (
                                <VStack
                                  p={5}
                                  gap={2}
                                  w={['full', null, '300px']}
                                >
                                  <Button
                                    as={NextLink}
                                    href={order.statusUrl}
                                    w='full'
                                    h='52px'
                                    colorScheme='brand-primary'
                                    disabled
                                  >
                                    {t(
                                      'account-page.orders-tab.labels.track-package'
                                    )}
                                  </Button>
                                  <Center>
                                    <Text color='brand-primary.500'>
                                      <InfoIcon />{' '}
                                      {t(
                                        `account-page.orders-tab.labels.${order.fulfillmentStatus}`
                                      )}
                                    </Text>
                                  </Center>
                                </VStack>
                              )}
                            </Flex>
                          </AccordionPanel>
                        </>
                      )}
                    </AccordionItem>
                  );
                })}
                <Flex justifyContent='space-between' w='full' mt='1rem'>
                  <Button
                    disabled={!user.orders.pageInfo.hasPreviousPage}
                    onClick={() => {
                      if (
                        !user.orders.pageInfo.startCursor ||
                        !user.orders.pageInfo.hasPreviousPage
                      ) {
                        paginationDataDispatch({ type: 'reset' });
                        return;
                      }
                      paginationDataDispatch({
                        type: 'prevPage',
                        payload: {
                          cursor: user.orders.pageInfo.startCursor
                        }
                      });
                    }}
                  >
                    Prev
                  </Button>
                  <Button
                    disabled={!user?.orders?.pageInfo.hasNextPage}
                    onClick={() => {
                      if (
                        !user?.orders?.pageInfo.endCursor ||
                        !user?.orders?.pageInfo.hasNextPage
                      ) {
                        paginationDataDispatch({ type: 'reset' });
                        return;
                      }
                      paginationDataDispatch({
                        type: 'nextPage',
                        payload: {
                          cursor: user.orders.pageInfo.endCursor
                        }
                      });
                    }}
                  >
                    Next
                  </Button>
                </Flex>
              </>
            ) : (
              <></>
            )}
          </Accordion>
        </SlideFade>
      ) : (
        <Center p={10}>
          <Spinner size='xl' />
        </Center>
      )}
    </>
  );
};

export default OrdersTabBody;
