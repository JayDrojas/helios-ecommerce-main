import { useQuery } from '@apollo/client';
import Head from 'next/head';
import { useShopifyAuth } from '@/components/ShopifyAuth/context/ShopifyAuthContext';
import { useEffect, useState } from 'react';
import {
  GetCustomerByAccessTokenQuery,
  GetCustomerByAccessTokenDocument
} from '@/graphql/shopify';
import Account from '@/components/Account';
import { Center, Spinner, useToast } from '@chakra-ui/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetServerSideProps } from 'next';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  try {
    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'en', ['common']))
      }
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
};

const AccountPage = () => {
  const { accessToken, processing } = useShopifyAuth();
  const { t } = useTranslation('common');
  const { push } = useRouter();
  const [user, setUser] =
    useState<GetCustomerByAccessTokenQuery['customer']>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const toast = useToast();
  const toastId = 'toad-id';

  const { data, loading } = useQuery(GetCustomerByAccessTokenDocument, {
    variables: {
      accessToken: accessToken ? accessToken.accessToken : ''
    },
    skip: processing
  });

  useEffect(() => {
    if (processing || loading) return;
    if (data && data.customer) {
      setUser(data.customer);
      setLoadingUser(false);
    } else {
      push('/auth/login');
      if (!toast.isActive(toastId)) {
        toast({
          title: t('authmessages.account-page-redirect-title'),
          description: t('authmessages.account-page-redirect-desc'),
          status: 'info',
          duration: 4000,
          isClosable: true
        });
      }
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>{t('account-page.title')}</title>
        <meta
          name='description'
          content={t('account-page.meta') ?? 'Account page'}
          key='acc'
        />
      </Head>
      {processing || loading || loadingUser ? (
        <Center p={10}>
          <Spinner size='xl' />
        </Center>
      ) : user ? (
        <Account user={user} setUser={setUser} />
      ) : (
        <Center p={10}>You must be logged in to view this page.</Center>
      )}
    </>
  );
};

export default AccountPage;
