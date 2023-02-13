import type { ProductDetailedQuery } from '@/graphql/shopify';
import getProductFormattedPrice from '@/lib/utils/get-product-formatted-price';
import {
  AspectRatio,
  Flex,
  Text,
  Image,
  Heading,
  Stack,
  Button
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import useCheckout from '@/lib/queries/checkout/hooks/useCheckout';

interface Props {
  productVariant: NonNullable<
    NonNullable<ProductDetailedQuery['product']>['variants']['nodes'][0]
  >;
  count: number | undefined;
  drawerOnOpen: () => void;
}

const CartPopoverBody = ({ productVariant, count, drawerOnOpen }: Props) => {
  const title = productVariant?.title;
  const {
    data: { cart }
  } = useCart();
  const { t } = useTranslation('common');
  const { initiateCheckout } = useCheckout();

  return (
    <Stack gap={4} p={4} direction='column'>
      <Flex gap={4}>
        <AspectRatio ratio={1} flex={1}>
          <Image
            fit='contain'
            src={productVariant?.image?.url}
            alt={productVariant?.title}
          />
        </AspectRatio>
        <Stack flex={1}>
          <Heading size='sm' as='h3'>
            {productVariant?.product.title}
          </Heading>
          <Text size='sm'>{title !== 'Default Title' ? title : ''}</Text>
        </Stack>
        <Text flex={1} color='brand-primary.400'>
          {productVariant ? getProductFormattedPrice(productVariant) : ''}
        </Text>
      </Flex>
      <Stack gap={2} direction='column'>
        <Button onClick={drawerOnOpen}>
          {t('cart-page.buttons.view')} ({count})
        </Button>
        {cart?.data ? (
          <Button
            onClick={() => initiateCheckout()}
            colorScheme='brand-primary'
          >
            {t('cart-page.buttons.proceed-checkout')}
          </Button>
        ) : (
          <></>
        )}
      </Stack>
    </Stack>
  );
};

export default CartPopoverBody;
