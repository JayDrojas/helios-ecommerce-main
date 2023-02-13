import {
  CustomerAddressUpdateDocument,
  GetCustomerWithAddressesQuery,
  GetCustomerWithAddressesQueryVariables
} from '@/graphql/shopify';
import {
  Flex,
  VStack,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  useToast,
  Button,
  GridItem,
  Select,
  Grid,
  HStack
} from '@chakra-ui/react';
import apollo from '@/lib/clients/apollo';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Dispatch, SetStateAction } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import type { z } from 'zod';
import { updateAddressSchema } from '../../schemas';
import { useShopifyAuth } from '@/components/ShopifyAuth/context/ShopifyAuthContext';
import { useTranslation } from 'react-i18next';
import { AddressAutofill } from '@mapbox/search-js-react';
import type { ApolloQueryResult } from '@apollo/client';

interface Props {
  user: GetCustomerWithAddressesQuery['customer'];
  address: NonNullable<
    GetCustomerWithAddressesQuery['customer']
  >['addresses']['nodes'][0];
  toggleEdit(): void;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  editable: boolean;
  setEditable: Dispatch<SetStateAction<boolean>>;
  paginationData: NonNullable<GetCustomerWithAddressesQueryVariables>;
  refetch: () => Promise<ApolloQueryResult<GetCustomerWithAddressesQuery>>;
}

/**
 * Note: This component uses Mapbox which only runs on Client side. So becareful when using it on pages that use SSR
 *
 * See link below for solution:
 * {@link https://stackoverflow.com/questions/73722569/reference-error-document-is-not-defined-in-mapbox-nextjs/737}
 * @param autoKey - The key from environemnt variables for Mapbox
 * @returns Address form with Autofill address using Mapbox
 *
 */
const AddressForm = ({
  address,
  toggleEdit,
  setLoading,
  loading,
  setEditable,
  editable,
  refetch
}: Props) => {
  const { accessToken } = useShopifyAuth();
  const toast = useToast();
  const { t } = useTranslation('common');

  const defaultValues: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string | undefined;
    zip: string;
    country: string;
    phone: string | null | undefined;
  } = {
    firstName: address.firstName ? address.firstName : '',
    lastName: address.lastName ? address.lastName : '',
    address1: address.address1 ? address.address1 : '',
    address2: address.address2 ? address.address2 : '',
    city: address.city ? address.city : '',
    country: address.country ? address.country : '',
    zip: address.zip ? address.zip : '',
    phone: address.phone ? address.phone : null
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<z.infer<typeof updateAddressSchema>>({
    resolver: zodResolver(updateAddressSchema),
    defaultValues
  });

  const onSubmit: SubmitHandler<z.infer<typeof updateAddressSchema>> = (
    formInput
  ) => {
    (async () => {
      setLoading(true);
      try {
        const parsedFormInput = updateAddressSchema.parse(formInput);

        const { data, errors } = await apollo.mutate({
          mutation: CustomerAddressUpdateDocument,
          variables: {
            address: { ...parsedFormInput, company: null, province: null },
            id: address.id ?? '',
            customerAccessToken: accessToken?.accessToken ?? ''
          }
        });

        if (errors?.length) {
          console.log('graphql error.');
          throw new Error('Something went wrong.');
        }

        if (
          data?.customerAddressUpdate?.customerUserErrors &&
          data.customerAddressUpdate.customerUserErrors.length > 0
        ) {
          const messages = data.customerAddressUpdate.customerUserErrors
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

        if (data?.customerAddressUpdate?.customerAddress) {
          toast({
            title: t('address-forms.messages.account-update'),
            description: t('address-forms.messages.account-update-desc'),
            status: 'success',
            isClosable: true
          });
          await refetch();
        }
      } catch (error) {
        reset();
        toast({
          title: t('address-forms.messages.error-title'),
          description: `${error}`,
          status: 'error',
          isClosable: true
        });
      } finally {
        setLoading(false);
        setEditable(false);
      }
    })();
  };

  const autoKey = process.env.NEXT_PUBLIC_MAPBOX_AUTOCOMPLETE_KEY ?? '';

  return (
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
                  readOnly={!editable}
                  variant={editable ? 'outline' : 'unstyled'}
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
                  readOnly={!editable}
                  variant={editable ? 'outline' : 'unstyled'}
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
                    readOnly={!editable}
                    variant={editable ? 'outline' : 'unstyled'}
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
                  readOnly={!editable}
                  variant={editable ? 'outline' : 'unstyled'}
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
                  readOnly={!editable}
                  variant={editable ? 'outline' : 'unstyled'}
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
                  variant={editable ? 'outline' : 'unstyled'}
                  fontWeight='bold'
                  bgColor='gray.100'
                  autoComplete='country-name'
                >
                  <option value='United States'>United States</option>
                  <option value='Mexico'>Mexico</option>
                  <option value='Canada'>Canada</option>
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
                  readOnly={!editable}
                  variant={editable ? 'outline' : 'unstyled'}
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
                  readOnly={!editable}
                  variant={editable ? 'outline' : 'unstyled'}
                  fontWeight='bold'
                  bgColor='gray.100'
                />
                <FormErrorMessage>
                  {errors.phone && errors.phone.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>
          <HStack>
            <Button
              onClick={toggleEdit}
              aria-label='cancel edit'
              bg='gray.300'
              color='gray'
              display='none'
              sx={{
                '@media (max-width: 600px)': {
                  display: 'block'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              isLoading={loading}
              loadingText='Saving'
              type='submit'
              colorScheme='brand-primary'
              mt={4}
              aria-label='Save'
            >
              {t('address-forms.buttons.save')}
            </Button>
          </HStack>
        </VStack>
        <IconButton
          onClick={toggleEdit}
          aria-label='exit edit'
          bg='none'
          size='lg'
          color='gray'
          sx={{
            '@media (max-width: 600px)': {
              display: 'none'
            }
          }}
          icon={<IoMdClose />}
        />
      </Flex>
    </form>
  );
};

export default AddressForm;
