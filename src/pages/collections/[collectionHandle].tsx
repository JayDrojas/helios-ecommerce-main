import CatalogView from '@/components/CatalogView';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import useLocale from '@/lib/utils/hooks/useLocale';
import apollo from '@/lib/clients/apollo';
import { ValidateCollectionHandleDocument } from '@/graphql/shopify';

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params
}) => {
  try {
    const collectionHandle = params?.collectionHandle;
    if (typeof collectionHandle !== 'string') throw new Error();
    const { data } = await apollo.query({
      query: ValidateCollectionHandleDocument,
      variables: { handle: collectionHandle }
    });
    if (!data?.collection?.handle) throw new Error();
    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        handle: data.collection.handle,
        title: data.collection.title
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

const Catalog = ({ handle, title }: { handle: string; title: string }) => {
  const { t } = useTranslation('common');

  const { languageCode } = useLocale();

  return (
    <>
      <Head key={languageCode + handle + 'head'}>
        <title>{title ?? t('catalog-page.title')}</title>
      </Head>

      <CatalogView
        handle={handle}
        key={languageCode + handle + 'catalogview'}
      />
    </>
  );
};

export default Catalog;
