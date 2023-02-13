import { useShopifyAuth } from '@/components/ShopifyAuth/context/ShopifyAuthContext';
import { Button } from '@chakra-ui/react';
import Head from 'next/head';

const Logout = () => {
  const {
    auth: {
      helpers: { triggerLogoutToHomescreen }
    }
  } = useShopifyAuth();
  return (
    <>
      <Head>
        <title>Logout</title>
      </Head>
      <Button onClick={triggerLogoutToHomescreen}>Click to Logout</Button>
    </>
  );
};

export default Logout;
