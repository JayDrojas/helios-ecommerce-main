import type { Section } from 'src/lib/interfaces';
import type { ShopifyDataMinimal } from 'src/lib/queries/get-page-data';
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Image,
  Text
} from '@chakra-ui/react';
import { useMemo } from 'react';
import NextLink from 'next/link';
import getProductHref from 'src/lib/utils/get-product-href';
import castColorTheme from '../../utils/cast-color-theme';
import { useTranslation } from 'react-i18next';

interface Image {
  src: string;
  description: string;
}

type Props = {
  section:
    | Section<'SectionDetailedProductShowcase'>
    | Section<'SectionDetailedLinkShowcase'>;
  shopifyData: ShopifyDataMinimal;
};
const SectionDetailedShowcase = ({ section, shopifyData }: Props) => {
  const colorTheme = castColorTheme(section.colorTheme);
  const { t } = useTranslation('common');

  const imagesArray = useMemo(() => {
    const output: Image[] = [];
    if (section.imagesCollection?.items) {
      section.imagesCollection.items.forEach((image) => {
        if (!image?.url) return;
        output.push({ src: image.url, description: image.description ?? '' });
      });
    } else if (
      section.__typename === 'SectionDetailedProductShowcase' &&
      shopifyData.products[section.product ?? '']?.featuredImage?.url
    ) {
      output.push({
        src: shopifyData.products[section.product ?? '']?.featuredImage?.url,
        description: shopifyData.products[section.product ?? '']?.title ?? ''
      });
    }
    return output;
  }, [section, shopifyData]);

  const headerText = section.header;
  const captionHeaderText = section.captionHeader;
  const captionBodyText = section.captionBody;
  const href =
    section.__typename === 'SectionDetailedLinkShowcase'
      ? section.link
      : getProductHref(
          shopifyData.products[section.product ?? '']?.handle ?? ''
        ) ?? null;
  const buttonText =
    section.__typename === 'SectionDetailedLinkShowcase'
      ? t('home.buttons.go-to')
      : t('home.buttons.view-product');

  return (
    <Box
      backgroundColor={colorTheme.backgroundColor}
      color={colorTheme.contentColor}
      as='section'
      w='full'
    >
      <Container maxW='container.xl' py={24} px={{ base: 4, md: 16 }}>
        {headerText ? (
          <Center>
            <Heading w='md' pb={24} textAlign='center'>
              {headerText}
            </Heading>
          </Center>
        ) : (
          <></>
        )}

        {imagesArray.length > 0 ? (
          <Flex
            height={{ base: 'full', md: 'lg' }}
            wrap={{ base: 'wrap', md: 'nowrap' }}
            justifyContent='space-around'
            gap='8'
            pb={26}
          >
            {imagesArray.map((image) => (
              <Box
                flex='1 100%'
                key={image.src}
                w='full'
                h={{ base: 'sm', md: 'full' }}
              >
                <Image
                  key={image.src}
                  src={image.src}
                  alt={image.description}
                  objectFit='cover'
                  h='full'
                  w='full'
                />
              </Box>
            ))}
          </Flex>
        ) : (
          <></>
        )}

        {captionHeaderText || captionBodyText ? (
          <Flex
            gap={{ base: 8, md: 24 }}
            direction={{ base: 'column', md: 'row' }}
          >
            <Heading size='md' w='full' flex='1' as='h3'>
              {captionHeaderText}
            </Heading>
            <Text fontSize='sm' flex='3' w='full' wordBreak='keep-all'>
              {captionBodyText}
            </Text>
            {href ? (
              <Button
                href={href}
                colorScheme='brand-primary'
                size='lg'
                as={NextLink}
              >
                {buttonText}
              </Button>
            ) : (
              <></>
            )}
          </Flex>
        ) : (
          <></>
        )}
      </Container>
    </Box>
  );
};

export default SectionDetailedShowcase;
