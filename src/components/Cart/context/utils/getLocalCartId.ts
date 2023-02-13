import apollo from '@/lib/clients/apollo';
import { CreateCartDocument, ValidateCartDocument } from '@/graphql/shopify';

export async function createNewCartId() {
  const { data, errors } = await apollo.mutate({
    mutation: CreateCartDocument
  });
  if (errors) {
    console.error(errors);
  }
  if (!data?.cartCreate?.cart?.id) {
    throw new Error('Unable to create a new cart.');
  }
  return data.cartCreate.cart.id;
}

export default async function getLocalCartId(key: string): Promise<string> {
  const stored = localStorage.getItem(key);
  let cartId: string;
  try {
    if (stored) {
      const { data, error } = await apollo.query({
        query: ValidateCartDocument,
        variables: { id: stored }
      });
      if (error || !data?.cart?.id) {
        throw new Error('ID is invalid. Creating a new Cart.');
      } else {
        cartId = data.cart.id;
      }
    } else {
      console.log('Data not found. Using initial value.');
      cartId = await createNewCartId();
      localStorage.setItem(key, cartId);
    }
  } catch (err) {
    console.log(err);
    cartId = await createNewCartId();
    localStorage.setItem(key, cartId);
  }

  return cartId;
}
