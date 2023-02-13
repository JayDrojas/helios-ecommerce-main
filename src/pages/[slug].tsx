import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import PageSections from '@/components/PageSections';
import getPageData, { ShopifyDataMinimal } from 'src/lib/queries/get-page-data';
import type { PageContentFromQuery } from 'src/lib/interfaces';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params
}) => {
  try {
    const slug = params?.slug;
    if (typeof slug !== 'string') throw new Error();
    const { content, shopifyData } = await getPageData(slug, locale ?? 'en');
    return {
      props: {
        content,
        shopifyData,
        ...(await serverSideTranslations(locale ?? 'en', ['common']))
      }
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
};

export interface Props {
  content: PageContentFromQuery;
  shopifyData: ShopifyDataMinimal;
}

const Home = ({ content, shopifyData }: Props) => {
  return (
    <>
      <Head>
        <title>
          {content.title ? `${content.title} - Helios Cycles` : 'Helios Cycles'}
        </title>
        <meta name='description' content={content.description ?? ''} />
      </Head>
      <PageSections
        sectionsCollection={content.sectionsCollection}
        shopifyData={shopifyData}
      />
    </>
  );
};

export default Home;
