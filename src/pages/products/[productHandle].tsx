import type { GetServerSideProps } from 'next';
import ProductDetailed from '@/components/ProductDetailed';
import Head from 'next/head';
import { useQuery } from '@apollo/client';
import { LanguageCode, ProductDetailedDocument } from '@/graphql/shopify';
import { Skeleton } from '@chakra-ui/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import useLocale from '@/lib/utils/hooks/useLocale';
import apollo from '@/lib/clients/apollo';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const productHandle = context.params?.productHandle;

  if (typeof productHandle !== 'string') {
    return {
      notFound: true
    };
  }

  const { data } = await apollo.query({
    query: ProductDetailedDocument,
    variables: { handle: productHandle, language: LanguageCode.En }
  });

  if (!data?.product?.id) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      productHandle,
      ...(await serverSideTranslations(context.locale ?? 'en', ['common']))
    }
  };
};

interface Props {
  productHandle: string;
}

const ProductDetailsPage = ({ productHandle }: Props) => {
  const { languageCode } = useLocale();

  const { loading, data } = useQuery(ProductDetailedDocument, {
    variables: { handle: productHandle, language: languageCode },
    fetchPolicy: 'no-cache'
  });
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{data?.product?.title ?? t('product-page.title')}</title>
        <meta
          name='description'
          content={data?.product?.description}
          key='acc'
        />
      </Head>
      {loading ? (
        <Skeleton h='75vh'></Skeleton>
      ) : (
        <ProductDetailed
          key={productHandle + languageCode}
          productHandle={productHandle}
          productData={data}
        />
      )}
    </>
  );
};

export default ProductDetailsPage;
