import { useShopifyAuth } from '@/components/ShopifyAuth/context/ShopifyAuthContext';
import {
  GetCustomerWithAddressesDocument,
  GetCustomerWithAddressesQuery
} from '@/graphql/shopify';
import { NetworkStatus, useQuery } from '@apollo/client';
import {
  Flex,
  VStack,
  Text,
  Button,
  Box,
  Center,
  Skeleton,
  Spinner,
  SlideFade
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAddressQueryVariables from '../../hooks/useAddressQueryVariables';
import DefaultAddressUpdateForm from './parts/DefaultAddressUpdateForm';
import OtherAddressForm from './parts/OtherAddressForm';
import dynamic from 'next/dynamic';

const DynamicHeader = dynamic(() => import('./parts/CreateAddressForm'), {
  ssr: false
});

const AddressTabBody = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const { accessToken } = useShopifyAuth();
  const { t } = useTranslation('common');
  const [loadingDefault, setLoadingDefault] = useState<boolean>(false);
  const [user, setCurrentUser] =
    useState<NonNullable<GetCustomerWithAddressesQuery>['customer']>();
  const defaultAddressId = user?.defaultAddress?.id;
  const pageCount = 5;

  const [paginationData, paginationDataDispatch] = useAddressQueryVariables(
    {
      first: pageCount,
      last: null,
      after: null,
      before: null,
      accessToken: accessToken?.accessToken ? accessToken.accessToken : ''
    },
    pageCount
  );

  const { refetch, networkStatus } = useQuery(
    GetCustomerWithAddressesDocument,
    {
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
    }
  );

  useEffect(() => {
    refetch(paginationData);
  }, [paginationData, refetch]);

  const addressesWithoutDefault = useMemo(() => {
    if (!user?.addresses.nodes || !defaultAddressId) return [];
    const index = user?.addresses?.nodes.findIndex(
      (address) => address.id === defaultAddressId
    );

    if (index === -1) return user.addresses.nodes;

    const copy = [...user?.addresses.nodes];
    copy.splice(index, 1);
    return copy;
  }, [user, defaultAddressId]);

  return (
    <>
      {networkStatus !== NetworkStatus.loading && user ? (
        <SlideFade offsetY='20px' in={user ? true : false}>
          <VStack gap={12} w='full'>
            <Skeleton w='full' isLoaded={!loadingDefault}>
              <Flex w='full' flexDirection='column'>
                {user?.defaultAddress ? (
                  <DefaultAddressUpdateForm
                    user={user}
                    address={user.defaultAddress}
                    paginationData={paginationData}
                    refetch={() => refetch(paginationData)}
                  />
                ) : (
                  <Center p={4}>
                    <Text>{t('address-forms.messages.no-address')}</Text>
                  </Center>
                )}
              </Flex>
            </Skeleton>
            {addressesWithoutDefault.length ? (
              <Flex w='full' flexDirection='column' gap={10}>
                <Text p={2} pl={0} color='black' fontWeight='semibold'>
                  {t('address-forms.labels.other')}
                </Text>{' '}
                {addressesWithoutDefault.map((address) => (
                  <Box key={address.id}>
                    <OtherAddressForm
                      user={user}
                      address={address}
                      setLoadingDefault={setLoadingDefault}
                      paginationData={paginationData}
                      refetch={refetch}
                      loadingDefault={loadingDefault}
                    />
                  </Box>
                ))}
              </Flex>
            ) : (
              ''
            )}
            {showForm ? (
              <DynamicHeader
                user={user}
                setShowForm={setShowForm}
                paginationData={paginationData}
                refetch={refetch}
              />
            ) : (
              ''
            )}
            <Button
              colorScheme='brand-primary'
              size='md'
              onClick={() => setShowForm(!showForm)}
            >
              {t('address-forms.buttons.create-address-bttn')}
            </Button>
            <Flex justifyContent='space-between' w='full'>
              <Button
                disabled={!user.addresses.pageInfo.hasPreviousPage}
                onClick={() => {
                  if (
                    !user.addresses.pageInfo.startCursor ||
                    !user.addresses.pageInfo.hasPreviousPage
                  ) {
                    paginationDataDispatch({ type: 'reset' });
                    return;
                  }
                  paginationDataDispatch({
                    type: 'prevPage',
                    payload: {
                      cursor: user.addresses.pageInfo.startCursor
                    }
                  });
                }}
              >
                Prev
              </Button>
              <Button
                disabled={!user?.addresses?.pageInfo.hasNextPage}
                onClick={() => {
                  if (
                    !user?.addresses?.pageInfo.endCursor ||
                    !user?.addresses?.pageInfo.hasNextPage
                  ) {
                    paginationDataDispatch({ type: 'reset' });
                    return;
                  }
                  paginationDataDispatch({
                    type: 'nextPage',
                    payload: {
                      cursor: user.addresses.pageInfo.endCursor
                    }
                  });
                }}
              >
                Next
              </Button>
            </Flex>
          </VStack>
        </SlideFade>
      ) : (
        <Center p={10}>
          <Spinner size='xl' />
        </Center>
      )}
    </>
  );
};

export default AddressTabBody;
