import { useCart } from '@/components/Cart/context/CartContext';
import { useShopifyAuth } from '@/components/ShopifyAuth/context/ShopifyAuthContext';
import {
  CheckoutCreateInput,
  CheckoutLineItemInput,
  GetCustomerByAccessTokenDocument
} from '@/graphql/shopify';
import apollo from '@/lib/clients/apollo';
import useLocale from '@/lib/utils/hooks/useLocale';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import createCheckout from '../createCheckout';
import { useTranslation } from 'react-i18next';

export default function useCheckout() {
  const { accessToken } = useShopifyAuth();
  const { data } = useCart();
  const { wipe } = data.actions;
  const router = useRouter();
  const { promise } = useToast();
  const { languageCode } = useLocale();
  const { t } = useTranslation('common');

  /** Calls `createCheckout()` with current user/cart state. */
  const initiateCheckout = useCallback(async () => {
    promise(
      (async () => {
        const cartItems = data.cart?.data?.lines.nodes;
        if (!cartItems || cartItems.length < 1) {
          throw new Error('Unable to create checkout: Cart is invalid.');
        }
        const lineItems: CheckoutLineItemInput[] = cartItems.map((cartItem) => {
          return {
            quantity: cartItem.quantity,
            variantId: cartItem.merchandise.id,
            customAttributes: []
          };
        });
        if (accessToken) {
          const { data, error } = await apollo.query({
            query: GetCustomerByAccessTokenDocument,
            variables: { accessToken: accessToken.accessToken }
          });
          if (error) throw error;
          if (!data.customer) {
            throw new Error(
              'Unable to find customer: Problem with accessing customer data.'
            );
          }
          const { email, defaultAddress } = data.customer;
          const {
            // eslint-disable-next-line unused-imports/no-unused-vars
            id,
            __typename,
            // eslint-disable-next-line unused-imports/no-unused-vars
            formatted,
            // eslint-disable-next-line unused-imports/no-unused-vars
            formattedArea,
            ...shippingAddress
          } = defaultAddress ?? {};
          const { webUrl } = await createCheckout({
            lineItems,
            email,
            shippingAddress: defaultAddress?.id
              ? ({
                  ...shippingAddress,
                  company: undefined,
                  province: undefined
                } as unknown as CheckoutCreateInput['shippingAddress'])
              : (undefined as unknown as CheckoutCreateInput['shippingAddress']),
            languageCode
          });
          wipe();
          router.push(webUrl);
        } else {
          const { webUrl } = await createCheckout({
            lineItems,
            email: null,
            shippingAddress: null,
            languageCode
          });
          wipe();
          router.push(webUrl);
        }
      })(),
      {
        loading: { title: t('cart-page.messages.creating-checkout') },
        error: (error) => {
          console.error(error);
          return { title: error.name, description: error.message };
        },
        success: {
          title: t('cart-page.messages.create-checkout-success'),
          description: t('cart-page.messages.create-checkout-redirecting')
        }
      }
    );
  }, [
    promise,
    data.cart?.data?.lines.nodes,
    accessToken,
    languageCode,
    wipe,
    router,
    t
  ]);

  return { initiateCheckout };
}
