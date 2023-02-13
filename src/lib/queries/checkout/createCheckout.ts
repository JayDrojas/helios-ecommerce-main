import {
  CheckoutCreateInput,
  CreateCheckoutDocument,
  InputMaybe,
  LanguageCode,
  MailingAddressInput
} from '@/graphql/shopify';
import apollo from '@/lib/clients/apollo';

interface CreateCheckoutArgs {
  lineItems: NonNullable<CheckoutCreateInput['lineItems']>;
  email: CheckoutCreateInput['email'] | null;
  shippingAddress: CheckoutCreateInput['shippingAddress'] | null;
  languageCode: LanguageCode;
}

/**
 * Create a checkout for the customer provided the checkout details.
 *
 * It doesn't consume user/cart state. Implement it when calling the function instead.
 * @see https://vincitusa.atlassian.net/wiki/spaces/HC/pages/181272577/Storefront+API+Checkouts+the+cool+way
 */
export default async function createCheckout({
  lineItems,
  email,
  shippingAddress,
  languageCode
}: CreateCheckoutArgs) {
  const { data, errors } = await apollo.mutate({
    mutation: CreateCheckoutDocument,
    variables: {
      email: email ?? (undefined as unknown as InputMaybe<string>), // I absolutely hate that this is necessary, as `null` throws an error.
      lineItems,
      shippingAddress: shippingAddress
        ? {
            ...shippingAddress
          }
        : (undefined as unknown as InputMaybe<MailingAddressInput>),
      languageCode
    }
  });

  if (errors) {
    throw new Error(
      errors.reduce((prev, curr) => prev + curr.message + ' ', '')
    );
  }
  if (
    data?.checkoutCreate?.checkoutUserErrors &&
    data?.checkoutCreate?.checkoutUserErrors.length > 0
  ) {
    throw new Error(
      'Something went wrong when creating the checkout... ' +
        data.checkoutCreate.checkoutUserErrors.reduce(
          (prev, curr) => prev + ' ' + curr.message,
          ''
        )
    );
  }
  if (!data?.checkoutCreate?.checkout) {
    throw new Error('Something went wrong when creating the checkout...');
  }
  return data.checkoutCreate.checkout;
}
