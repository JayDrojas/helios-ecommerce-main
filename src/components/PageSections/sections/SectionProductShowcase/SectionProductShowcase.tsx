import type { Maybe, Section } from 'src/lib/interfaces';
import type { ShopifyDataMinimal } from 'src/lib/queries/get-page-data';
import {
  Box,
  Button,
  Flex,
  Image,
  Container,
  Spacer,
  Heading
} from '@chakra-ui/react';
import NextLink from 'next/link';
import type { MetaColorTheme } from '@/graphql/contentful';
import castColorTheme from '../../utils/cast-color-theme';
import { useTranslation } from 'react-i18next';

interface Props {
  section: Section<'SectionProductShowcase'>;
  shopifyData: ShopifyDataMinimal;
}

const SectionProductShowcase = ({ section, shopifyData }: Props) => {
  const colorTheme = castColorTheme(
    section.colorTheme as Maybe<MetaColorTheme>
  );
  const product = shopifyData.products[section.product ?? ''];
  const header = section.header ?? product?.title;
  const href = `/products/${product?.handle}`;
  const { t } = useTranslation('common');

  return (
    <Box
      backgroundColor={colorTheme.backgroundColor}
      color={colorTheme.contentColor}
      as='section'
    >
      <Container maxW='container.xl' py={24} px={{ base: 4, md: 16 }}>
        <Flex mb={12} gap={4} direction={{ base: 'column', md: 'row' }}>
          <Heading size='md' as='h3' textAlign={'center'}>
            {header}
          </Heading>
          <Spacer />
          <Button
            href={href}
            colorScheme='brand-primary'
            size='lg'
            w={{ base: 'full', md: 'fit-content' }}
            as={NextLink}
          >
            {t('home.buttons.view-product')}
          </Button>
        </Flex>
        <Image
          src={section.showcaseImage?.url ?? product?.featuredImage?.url}
          alt={section.showcaseImage?.description ?? product?.title}
          h={{ base: 'sm', md: 'xl' }}
          width='full'
          fit='cover'
        />
      </Container>
    </Box>
  );
};

export default SectionProductShowcase;
