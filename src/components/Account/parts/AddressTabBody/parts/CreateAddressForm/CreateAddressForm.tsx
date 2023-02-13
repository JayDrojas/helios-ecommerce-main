import {
  Flex,
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Card,
  CardBody,
  FormErrorMessage,
  Button,
  CardHeader,
  useToast,
  GridItem,
  Select,
  IconButton,
  Text,
  Grid
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { createAddressSchema } from '../../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import {
  CustomerAddressCreateDocument,
  GetCustomerWithAddressesDocument,
  GetCustomerWithAddressesQuery,
  GetCustomerWithAddressesQueryVariables
} from '@/graphql/shopify';
import apollo from '@/lib/clients/apollo';
import { useShopifyAuth } from '@/components/ShopifyAuth/context/ShopifyAuthContext';
import { IoMdClose } from 'react-icons/io';
import { useTranslation } from 'react-i18next';
import type { ApolloQueryResult } from '@apollo/client';
import { AddressAutofill } from '@mapbox/search-js-react';

interface Props {
  user: GetCustomerWithAddressesQuery['customer'];
  setShowForm: Dispatch<SetStateAction<boolean>>;
  paginationData: NonNullable<GetCustomerWithAddressesQueryVariables>;
  refetch: () => Promise<ApolloQueryResult<GetCustomerWithAddressesQuery>>;
}

const CreateAddressForm = ({ setShowForm, paginationData, refetch }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { accessToken } = useShopifyAuth();
  const toast = useToast();
  const { t } = useTranslation('common');
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<z.infer<typeof createAddressSchema>>({
    resolver: zodResolver(createAddressSchema)
  });
  const onSubmit: SubmitHandler<z.infer<typeof createAddressSchema>> = (
    formInput
  ) => {
    (async () => {
      setLoading(true);
      try {
        const parsedFormInput = createAddressSchema.parse(formInput);
        const { data, errors } = await apollo.mutate({
          mutation: CustomerAddressCreateDocument,
          variables: {
            address: { ...parsedFormInput, company: null, province: null },
            customerAccessToken: accessToken?.accessToken
              ? accessToken?.accessToken
              : ''
          },
          refetchQueries: () => [
            {
              query: GetCustomerWithAddressesDocument,
              variables: paginationData
            }
          ]
        });

        if (
          data?.customerAddressCreate?.customerUserErrors &&
          data.customerAddressCreate.customerUserErrors.length > 0
        ) {
          const messages = data?.customerAddressCreate?.customerUserErrors
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

        if (data?.customerAddressCreate?.customerAddress) {
          toast({
            title: t('address-forms.messages.address-created-success'),
            description: t(
              'address-forms.messages.address-created-success-desc'
            ),
            status: 'success',
            isClosable: true
          });
          setShowForm(false);
        }
      } catch (error) {
        toast({
          title: t('address-forms.messages.create-address'),
          description: `${error}`,
          status: 'error',
          isClosable: true
        });
      } finally {
        setLoading(false);
        reset();
        refetch();
      }
    })();
  };

  const autoKey = process.env.NEXT_PUBLIC_MAPBOX_AUTOCOMPLETE_KEY ?? '';

  return (
    <Card
      w='full'
      borderRadius='md'
      borderColor='grey.200'
      borderWidth='1px'
      p={8}
    >
      <CardHeader>
        {' '}
        <Text p={2} pl={0} color='black' fontWeight='semibold'>
          {t('address-forms.messages.create-address')}
        </Text>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex justifyContent='space-between' color='black' gap={4}>
            <VStack gap={4} w='full'>
              <Grid
                templateColumns={['repeat(2, 1fr)']}
                columnGap={3}
                rowGap={6}
                w='full'
              >
                <GridItem colSpan={[2, 2, 1]}>
                  <FormControl isInvalid={!!errors.firstName}>
                    <FormLabel color='brand-primary.500'>
                      {t('address-forms.labels.first-name')}
                    </FormLabel>
                    <Input
                      {...register('firstName')}
                      fontWeight='bold'
                      bgColor='gray.100'
                    />
                    <FormErrorMessage>
                      {errors.firstName && errors.firstName.message}
                    </FormErrorMessage>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={[2, 2, 1]}>
                  <FormControl isInvalid={!!errors.lastName}>
                    <FormLabel color='brand-primary.500'>
                      {t('address-forms.labels.last-name')}
                    </FormLabel>
                    <Input
                      {...register('lastName')}
                      fontWeight='bold'
                      bgColor='gray.100'
                    />
                    <FormErrorMessage>
                      {errors.lastName && errors.lastName.message}
                    </FormErrorMessage>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2}>
                  <FormControl isInvalid={!!errors.address1}>
                    <FormLabel color='brand-primary.500'>
                      {t('address-forms.labels.address1')}
                    </FormLabel>
                    <AddressAutofill accessToken={autoKey}>
                      <Input
                        {...register('address1')}
                        fontWeight='bold'
                        bgColor='gray.100'
                        autoComplete='address-line1'
                      />
                    </AddressAutofill>
                    <FormErrorMessage>
                      {errors.address1 && errors.address1.message}
                    </FormErrorMessage>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2}>
                  <FormControl isInvalid={!!errors.address2}>
                    <FormLabel color='brand-primary.500'>
                      {t('address-forms.labels.address2')}
                    </FormLabel>
                    <Input
                      {...register('address2')}
                      fontWeight='bold'
                      bgColor='gray.100'
                      autoComplete='address-line2'
                    />
                    <FormErrorMessage>
                      {errors.address2 && errors.address2.message}
                    </FormErrorMessage>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={[2, 2, 1]}>
                  <FormControl isInvalid={!!errors.city}>
                    <FormLabel color='brand-primary.500'>
                      {t('address-forms.labels.city')}
                    </FormLabel>
                    <Input
                      {...register('city')}
                      fontWeight='bold'
                      bgColor='gray.100'
                      autoComplete='address-level2'
                    />
                    <FormErrorMessage>
                      {errors.city && errors.city.message}
                    </FormErrorMessage>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={[2, 2, 1]}>
                  <FormControl isInvalid={!!errors.country}>
                    <FormLabel color='brand-primary.500'>
                      {t('address-forms.labels.country')}
                    </FormLabel>
                    <Select
                      {...register('country')}
                      fontWeight='bold'
                      bgColor='gray.100'
                      autoComplete='country-name'
                    >
                      <option value='United States'>
                        {t('address-forms.country-select.usa')}
                      </option>
                      <option value='Mexico'>
                        {t('address-forms.country-select.mx')}
                      </option>
                      <option value='Canada'>
                        {t('address-forms.country-select.cad')}
                      </option>
                    </Select>
                    <FormErrorMessage>
                      {errors.country && errors.country.message}
                    </FormErrorMessage>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={[2, 2, 1]}>
                  <FormControl isInvalid={!!errors.zip}>
                    <FormLabel color='brand-primary.500'>
                      {t('address-forms.labels.zip')}
                    </FormLabel>
                    <Input
                      {...register('zip')}
                      fontWeight='bold'
                      bgColor='gray.100'
                      autoComplete='postal-code'
                    />
                    <FormErrorMessage>
                      {errors.zip && errors.zip.message}
                    </FormErrorMessage>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={[2, 2, 1]}>
                  <FormControl isInvalid={!!errors.phone}>
                    <FormLabel color='brand-primary.500'>
                      {t('address-forms.labels.phone-number')}
                    </FormLabel>
                    <Input
                      {...register('phone')}
                      fontWeight='bold'
                      bgColor='gray.100'
                    />
                    <FormErrorMessage>
                      {errors.phone && errors.phone.message}
                    </FormErrorMessage>
                  </FormControl>
                </GridItem>
              </Grid>
              <Box>
                <Button
                  isLoading={loading}
                  loadingText='Saving'
                  type='submit'
                  colorScheme='brand-primary'
                  mt={4}
                >
                  {t('address-forms.buttons.save')}
                </Button>
              </Box>
            </VStack>
            <IconButton
              onClick={(e) => setShowForm(false)}
              aria-label='exit edit'
              bg='none'
              size='lg'
              color='gray'
              icon={<IoMdClose />}
            />
          </Flex>
        </form>
      </CardBody>
    </Card>
  );
};

export default CreateAddressForm;
