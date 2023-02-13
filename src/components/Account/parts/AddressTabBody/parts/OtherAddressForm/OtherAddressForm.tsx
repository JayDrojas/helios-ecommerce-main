import { useShopifyAuth } from '@/components/ShopifyAuth/context/ShopifyAuthContext';
import {
  CustomerAddressDeleteDocument,
  CustomerDefaultAddressUpdateDocument,
  GetCustomerWithAddressesQuery,
  GetCustomerWithAddressesQueryVariables
} from '@/graphql/shopify';
import apollo from '@/lib/clients/apollo';
import type { ApolloQueryResult } from '@apollo/client';
import {
  Stack,
  Button,
  IconButton,
  Box,
  useToast,
  Card,
  CardBody,
  Text,
  Divider,
  Skeleton,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MdDelete, MdModeEdit } from 'react-icons/md';

import dynamic from 'next/dynamic';

const DynamicHeader = dynamic(() => import('../AddressForm'), {
  ssr: false
});

interface Props {
  user: GetCustomerWithAddressesQuery['customer'];
  setLoadingDefault: Dispatch<SetStateAction<boolean>>;
  loadingDefault: boolean;
  address: NonNullable<
    GetCustomerWithAddressesQuery['customer']
  >['addresses']['nodes'][0];
  paginationData: NonNullable<GetCustomerWithAddressesQueryVariables>;
  refetch: () => Promise<ApolloQueryResult<GetCustomerWithAddressesQuery>>;
}

const OtherAddressForm = ({
  user,
  address,
  setLoadingDefault,
  paginationData,
  refetch
}: Props) => {
  const [editable, setEditable] = useState<boolean>(false);
  const { accessToken } = useShopifyAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { t } = useTranslation('common');

  async function handleDefaultAddressChange() {
    setLoading(true);
    setLoadingDefault(true);
    try {
      const { data, errors } = await apollo.mutate({
        mutation: CustomerDefaultAddressUpdateDocument,
        variables: {
          customerAccessToken: accessToken?.accessToken
            ? accessToken.accessToken
            : '',
          addressId: address.id
        }
      });

      if (
        data?.customerDefaultAddressUpdate?.customerUserErrors &&
        data.customerDefaultAddressUpdate.customerUserErrors.length > 0
      ) {
        const messages = data.customerDefaultAddressUpdate.customerUserErrors
          .map((error) => {
            if (error.code === 'TAKEN') {
              const errorMessage = t(
                'address-forms.messages.address-already-saved'
              );
              throw new Error(errorMessage);
            } else {
              return error.message;
            }
          })
          .join(' ');

        throw new Error(messages);
      }

      if (errors?.length) {
        console.log('graphql error.');
        throw new Error('Something went wrong.');
      }

      if (data?.customerDefaultAddressUpdate?.customer?.defaultAddress) {
        toast({
          title: t('address-forms.messages.address-created-success'),
          description: t('address-forms.messages.address-created-success-desc'),
          status: 'success',
          isClosable: true
        });
        await refetch();
      }
    } catch (error) {
      toast({
        title: `${error}`,
        status: 'error',
        isClosable: true
      });
    } finally {
      setLoading(false);
      setLoadingDefault(false);
    }
  }

  function toggleEdit() {
    setEditable(!editable);
  }

  return (
    <>
      <Skeleton isLoaded={!loading} w='full' fadeDuration={1} speed={1}>
        <Card
          w='full'
          borderRadius='md'
          borderColor='gray.50'
          borderWidth='1px'
          p={[2, 8]}
        >
          <CardBody color='gray'>
            {!editable ? (
              <Grid
                templateColumns={['repeat(2, 1fr)']}
                columnGap={3}
                rowGap={6}
                w='full'
              >
                <GridItem colSpan={[2, 1]}>
                  <Stack w='full' fontWeight='semibold' p={[2, 0]}>
                    <Box>
                      {address.formatted
                        ? address.formatted.map((part, index) => (
                            <Text key={index}>{part}</Text>
                          ))
                        : ''}
                    </Box>
                    <Box>
                      <Text>
                        {t('address-forms.labels.phone')}: {address.phone}
                      </Text>
                    </Box>
                  </Stack>
                </GridItem>
                <GridItem colSpan={[2, 1]} w='full' height='full'>
                  <Stack direction={['row']} w='full'>
                    <Button
                      noOfLines={2}
                      variant='unstyled'
                      minW={141}
                      type='button'
                      aria-label='Set default address'
                      padding={2}
                      w='full'
                      height='full'
                      margin='auto'
                      onClick={handleDefaultAddressChange}
                      wordBreak='break-word'
                      whiteSpace='normal'
                    >
                      {t('address-forms.buttons.set-default')}
                    </Button>
                    <Divider orientation='vertical' />
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
                              customerAccessToken:
                                accessToken?.accessToken ?? '',
                              id: address.id
                            }
                          });
                          if (
                            errors?.length ||
                            !data?.customerAddressDelete
                              ?.deletedCustomerAddressId
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
                  </Stack>
                </GridItem>
              </Grid>
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

export default OtherAddressForm;
