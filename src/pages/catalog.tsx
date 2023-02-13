import CatalogView from '@/components/CatalogView';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import useLocale from '@/lib/utils/hooks/useLocale';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  try {
    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'en', ['common']))
        /* The line below will always load all the languages in the second array regardless of language */
        // ...(await serverSideTranslations(locale ?? 'en', ['common'], null, ['en', 'es']))
      }
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
};

const Catalog = () => {
  const { t } = useTranslation('common');

  const { languageCode } = useLocale();

  return (
    <>
      <Head>
        <title>{t('catalog-page.title')}</title>
      </Head>

      <CatalogView handle='catalog' key={languageCode} />
    </>
  );
};

export default Catalog;
