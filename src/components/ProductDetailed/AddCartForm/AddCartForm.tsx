import { useCart } from '@/components/Cart/context/CartContext';
import { useNewProductPopover } from '@/components/Cart/parts/CartPopoverBody/context/NewProductPopoverContext';
import type { ProductDetailedQuery } from '@/graphql/shopify';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Text,
  useToast
} from '@chakra-ui/react';
import type { UseFormReturn } from 'react-hook-form';
import getProductFormattedPrice from '@/lib/utils/get-product-formatted-price';
import { useTranslation } from 'react-i18next';
import React from 'react';

type Options = NonNullable<ProductDetailedQuery['product']>['options'];

interface Props {
  options: Options | undefined | null;
  productHandle: string;
  form: UseFormReturn;
  variantData:
    | NonNullable<
        NonNullable<ProductDetailedQuery['product']>['variants']['nodes'][0]
      >
    | null
    | undefined;
}

const AddCartForm = ({
  options,
  form: { register, handleSubmit },
  variantData
}: Props) => {
  const toast = useToast();
  const { data, initializing: cartLoading, processing } = useCart();
  const { setPopoverContent } = useNewProductPopover();
  const { t } = useTranslation('common');
  const isOutOfStock = (variantData?.quantityAvailable ?? 0) < 1;

  let limitExceeded = false;

  /*  
   this checks if variantData.id matches the id of an item in the cart.  
   If it does we set limitExceeded to true */
  if (!cartLoading && data.cart) {
    const item = data.cart.data?.lines.nodes.find(
      (current) => current.merchandise.id == variantData?.id
    );

    if (
      item &&
      variantData?.quantityAvailable &&
      (item.quantity >= variantData?.quantityAvailable || item.quantity >= 10)
    ) {
      limitExceeded = true;
    } else limitExceeded = false;
  }

  async function addToCart() {
    if (!variantData?.id) throw Error('Item variant does not exist.');
    if (cartLoading || !data) throw Error('Cart is still loading');
    if (processing) throw Error('Cart is currently processing.');
    const id = variantData.id;

    const available = variantData.quantityAvailable ?? 0;
    if (data.cart) {
      const itemInCart = data.cart.data?.lines.nodes.find(
        (current) => current.merchandise.id == variantData?.id
      );
      const numberInCart = itemInCart?.quantity ?? 0;
      if (numberInCart >= available || numberInCart >= 10) {
        return toast({
          title: t('product-page.messages.toast-limit-exceeded'),
          description: t('product-page.messages.toast-limit-exceeded-desc'),
          status: 'error',
          isClosable: true
        });
      }
    }

    try {
      await data.actions.add(id);
      setPopoverContent(variantData);
    } catch (err) {
      console.error(err);
    }
  }

  const title = variantData?.title ?? '';

  return (
    <Box maxW='100%' my={4}>
      <Box>
        {!variantData ? (
          <Text>{t('product-page.messages.variant-non-exists')}</Text>
        ) : (
          <></>
        )}

        <Heading size='md'>{title !== 'Default Title' ? title : ''}</Heading>
        <Text fontSize='sm' color='brand-primary.400' mt={4}>
          {variantData ? getProductFormattedPrice(variantData) : ''}
        </Text>
      </Box>
      <Box mt={12}>
        <form onSubmit={handleSubmit(addToCart)}>
          {options?.map((option) =>
            // option.name !== 'Title' && option.name !== 'Título'
            !['Title', 'Título'].includes(option.name) ? (
              <FormControl key={option.id} my={4}>
                <FormLabel>{option.name}</FormLabel>
                <Select {...register(option.name)} bgColor='gray.100' my={2}>
                  {option.values.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <React.Fragment key={option.id} />
            )
          )}
          <Button
            type='submit'
            colorScheme='brand-primary'
            mt={12}
            mb={2}
            disabled={
              !variantData ||
              isOutOfStock ||
              cartLoading ||
              processing ||
              !variantData
            }
          >
            {t('product-page.buttons.add-cart')}
          </Button>
          {isOutOfStock && !!variantData ? (
            <Text>{t('product-page.messages.out-of-stock')} 😢</Text>
          ) : (
            <></>
          )}
          {limitExceeded ? (
            <Text>{t('product-page.messages.limit-exceeded')}</Text>
          ) : (
            <></>
          )}
        </form>
      </Box>
    </Box>
  );
};

export default AddCartForm;
