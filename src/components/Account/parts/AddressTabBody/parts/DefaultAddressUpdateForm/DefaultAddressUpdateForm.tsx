import { useShopifyAuth } from '@/components/ShopifyAuth/context/ShopifyAuthContext';
import {
  CustomerAddressDeleteDocument,
  GetCustomerWithAddressesQuery,
  GetCustomerWithAddressesQueryVariables
} from '@/graphql/shopify';
import apollo from '@/lib/clients/apollo';
import type { ApolloQueryResult } from '@apollo/client';
import {
  Flex,
  Stack,
  Box,
  Text,
  IconButton,
  Card,
  CardBody,
  Skeleton,
  useToast
} from '@chakra-ui/react';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MdDelete, MdModeEdit } from 'react-icons/md';

import dynamic from 'next/dynamic';

const DynamicHeader = dynamic(() => import('../AddressForm'), {
  ssr: false
});

interface Props {
  user: GetCustomerWithAddressesQuery['customer'];
  address: NonNullable<
    GetCustomerWithAddressesQuery['customer']
  >['addresses']['nodes'][0];
  paginationData: NonNullable<GetCustomerWithAddressesQueryVariables>;
  refetch: () => Promise<ApolloQueryResult<GetCustomerWithAddressesQuery>>;
}

const DefaultAddressUpdateForm = ({
  user,
  address,
  paginationData,
  refetch
}: Props) => {
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation('common');
  const { accessToken } = useShopifyAuth();
  const toast = useToast();

  function toggleEdit() {
    setEditable(!editable);
  }

  return (
    <>
      <Skeleton isLoaded={!loading} w='full'>
        <Text p={4} pl={0} color='black' fontWeight='semibold'>
          {t('address-forms.labels.default-address')}
        </Text>{' '}
        <Card
          w='full'
          borderRadius='md'
          borderColor='grey.200'
          borderWidth='1px'
          p={8}
        >
          <CardBody>
            {!editable ? (
              <Flex justifyContent='space-between'>
                <Stack w='md' fontWeight='bold'>
                  <Box>
                    {user?.defaultAddress
                      ? user.defaultAddress.formatted.map((part, index) => (
                          <Text key={index}>{part}</Text>
                        ))
                      : ''}
                  </Box>
                  <Box>
                    <Text>
                      {t('address-forms.labels.phone')}:{' '}
                      {user?.defaultAddress?.phone}
                    </Text>
                  </Box>
                </Stack>
                <Stack direction={['column', 'row']}>
                  <IconButton
                    onClick={toggleEdit}
                    aria-label='edit'
                    bg='none'
                    size='lg'
                    color='gray'
                    icon={<MdModeEdit />}
                  />
                  <IconButton
                    onClick={async () => {
                      const { data, errors } = await apollo.mutate({
                        mutation: CustomerAddressDeleteDocument,
                        variables: {
                          customerAccessToken: accessToken?.accessToken ?? '',
                          id: address.id
                        }
                      });
                      if (
                        errors?.length ||
                        !data?.customerAddressDelete?.deletedCustomerAddressId
                      ) {
                        toast({
                          title: t(
                            'address-forms.messages.address-deleted-error'
                          ),
                          description: t(
                            'address-forms.messages.address-deleted-error-desc'
                          ),
                          status: 'error',
                          isClosable: true
                        });
                      } else {
                        toast({
                          title: t(
                            'address-forms.messages.address-deleted-success'
                          ),
                          description: t(
                            'address-forms.messages.address-deleted-success-desc'
                          ),
                          status: 'success',
                          isClosable: true
                        });
                      }
                      await refetch();
                    }}
                    aria-label='delete'
                    bg='none'
                    size='lg'
                    color='gray'
                    icon={<MdDelete />}
                  />
                </Stack>
              </Flex>
            ) : (
              <DynamicHeader
                user={user}
                address={address}
                toggleEdit={toggleEdit}
                setLoading={setLoading}
                loading={loading}
                editable={editable}
                setEditable={setEditable}
                paginationData={paginationData}
                refetch={refetch}
              />
            )}
          </CardBody>
        </Card>
      </Skeleton>
    </>
  );
};

export default DefaultAddressUpdateForm;
