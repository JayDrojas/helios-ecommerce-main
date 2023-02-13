import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { ChakraProvider, Flex } from '@chakra-ui/react';
import { SkipNavLink, SkipNavContent } from '@chakra-ui/skip-nav';
import { ApolloProvider } from '@apollo/client';
import Navbar from '@/components/Navbar';
import apollo from 'src/lib/clients/apollo';
import theme from 'src/lib/chakra-theme';
import { PropsWithChildren, useEffect } from 'react';
import {
  CartContext,
  useCart,
  useCartState,
  useLocalCartId
} from '@/components/Cart/context/CartContext';
import Footer from '@/components/Footer';
import {
  NewProductPopoverContext,
  useNewProductPopoverState
} from '@/components/Cart/parts/CartPopoverBody/context/NewProductPopoverContext';
import {
  ShopifyAuthContext,
  useShopifyAuth,
  useShopifyAuthClientGenerator
} from '@/components/ShopifyAuth/context/ShopifyAuthContext';
import useLocale from '@/lib/utils/hooks/useLocale';
import Head from 'next/head';

const Layout = ({ children }: PropsWithChildren) => {
  const { accessToken, initialized: authInitialized } = useShopifyAuth();
  const {
    initializing: cartInitializing,
    data: {
      actions: { attachUser, detachUser, refresh }
    }
  } = useCart();
  const { languageCode } = useLocale();

  useEffect(() => {
    (async () => {
      if (!authInitialized || cartInitializing) return;

      if (!accessToken?.accessToken) {
        await detachUser();
      } else {
        await attachUser(accessToken.accessToken);
      }
      await refresh(languageCode);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, authInitialized, cartInitializing]);

  return (
    <>
      <Flex minH='100vh' flexDirection='column'>
        <SkipNavLink zIndex={'toast'}>Skip to Content</SkipNavLink>
        <Navbar />
        <Flex flexGrow={1} flexDirection='column'>
          {children}
        </Flex>
        <Footer />
        <SkipNavContent />
      </Flex>
    </>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  const shopifyAuthContext = useShopifyAuthClientGenerator();
  const { data } = useLocalCartId();
  const cartState = useCartState(data);
  const newProductPopoverState = useNewProductPopoverState();

  return (
    <>
      <Head>
        <link rel='icon' href='/favicon.svg' />
      </Head>
      <ApolloProvider client={apollo}>
        <ShopifyAuthContext.Provider value={shopifyAuthContext}>
          <CartContext.Provider value={cartState}>
            <NewProductPopoverContext.Provider value={newProductPopoverState}>
              <ChakraProvider theme={theme}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </ChakraProvider>
            </NewProductPopoverContext.Provider>
          </CartContext.Provider>
        </ShopifyAuthContext.Provider>
      </ApolloProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
