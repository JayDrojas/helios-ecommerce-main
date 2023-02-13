import type { CollectionMinimalQuery } from '@/graphql/shopify';
import type { Section } from 'src/lib/interfaces';
import type { ShopifyDataMinimal } from 'src/lib/queries/get-page-data';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Spacer
} from '@chakra-ui/react';
import SingleProductBlock from '@/components/common/SingleProductBlock';
import castColorTheme from '../../utils/cast-color-theme';
import { useTranslation } from 'react-i18next';
import NextLink from 'next/link';
import getCollectionHref from '@/lib/utils/get-collection-href';

interface Props {
  section: Section<'SectionCollectionShowcase'>;
  shopifyData: ShopifyDataMinimal;
}

type ProductsCollection = NonNullable<
  CollectionMinimalQuery['collection']
>['products']['nodes'];

const SectionCollectionShowcase = ({ section, shopifyData }: Props) => {
  const { shopifyCollection: collectionId } = section;
  const colorTheme = castColorTheme(section.colorTheme);
  const { t } = useTranslation('common');

  const headerText: string =
    section.customDisplayHeader ??
    shopifyData.collections[collectionId ?? '']?.title ??
    '';
  const products = shopifyData.collections[collectionId ?? '']?.products
    .nodes as ProductsCollection;

  return (
    <Box
      backgroundColor={colorTheme.backgroundColor}
      color={colorTheme.contentColor}
      as='section'
    >
      <Container maxW='container.xl' py={20} px={{ base: 4, md: 16 }}>
        <Flex mb={12} alignItems='center'>
          <Heading size='md' as='h3'>
            {headerText}
          </Heading>
          <Spacer />
          <Button
            as={NextLink}
            href={getCollectionHref(
              shopifyData.collections[collectionId ?? '']?.['handle'] ?? ''
            )}
            colorScheme='brand-primary'
          >
            {t('home.buttons.see-all')}
          </Button>
        </Flex>
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          w={{ base: '75%', sm: 'full' }}
          mx='auto'
          justifyContent='space-between'
        >
          {products.map((product) => (
            <SingleProductBlock key={product.id} {...product} />
          ))}
        </Flex>
      </Container>
    </Box>
  );
};

export default SectionCollectionShowcase;
