import { GetCustomerByAccessTokenDocument } from '@/graphql/shopify';
import apollo from '@/lib/clients/apollo';

export default async function getCustomerQuery(accessToken: string) {
  if (accessToken) {
    try {
      const { data, errors } = await apollo.query({
        query: GetCustomerByAccessTokenDocument,
        variables: {
          accessToken: accessToken
        }
      });

      if (errors) {
        throw new Error('There was an error.');
      } else if (!data.customer) {
        throw new Error('Customer was not found.');
      } else {
        return data.customer;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
