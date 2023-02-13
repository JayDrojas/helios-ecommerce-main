import { Button, Heading, VStack } from '@chakra-ui/react';
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import NextLink from 'next/link';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common']))
    }
  };
};

const Custom404 = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{t('meta.404') ?? 'Page Not Found'}</title>
      </Head>
      <VStack py={32}>
        <Heading textAlign={'center'} pb={4}>
          {t('meta.404')}
        </Heading>
        <Button as={NextLink} href='/'>
          {t('meta.back-home')}
        </Button>
      </VStack>
    </>
  );
};

export default Custom404;
