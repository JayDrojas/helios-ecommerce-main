import type { ProductMinimalQuery } from '@/graphql/shopify';
import getFormattedCost from '@/lib/utils/get-formatted-cost';
import getProductHref from '@/lib/utils/get-product-href';
import {
  Box,
  LinkBox,
  LinkOverlay,
  Text,
  Image,
  AspectRatio,
  Heading,
  Badge
} from '@chakra-ui/react';
import NextLink from 'next/link';

function getPriceText(product: ProductMinimalQuery['product']): string {
  const minVariantPrice =
    Number(product?.priceRange.minVariantPrice.amount) ?? 0;
  const currencyCode = product?.priceRange.minVariantPrice.currencyCode ?? '';
  const maxVariantPrice =
    Number(product?.priceRange.maxVariantPrice.amount) ?? 0;

  const cost = getFormattedCost(minVariantPrice, currencyCode);

  if (minVariantPrice !== maxVariantPrice) {
    return cost + '+';
  }
  return cost;
}

const SingleProduct = (
  product:
    | NonNullable<ProductMinimalQuery['product']> & {
        variantTitle?: string;
        variantId?: string;
      }
) => {
  return (
    <LinkBox
      as='article'
      p={4}
      borderRadius='md'
      w='full'
      _hover={{
        background: 'gray.100'
      }}
      transition={'0.2s ease'}
    >
      <AspectRatio ratio={1 / 1}>
        <Box bg='white'>
          <Image
            h='full'
            objectFit='contain'
            src={product.featuredImage?.url}
            alt={product.title}
          />
        </Box>
      </AspectRatio>
      <>
        {product.metafield?.value ? (
          <Badge
            colorScheme='brand-primary'
            variant='solid'
            position='absolute'
            top={2}
            left={2}
          >
            {product.metafield.value}
          </Badge>
        ) : (
          <></>
        )}
      </>
      <Box pt='4'>
        <LinkOverlay
          as={NextLink}
          href={
            product.variantId
              ? getProductHref(product.handle, product.variantId)
              : getProductHref(product.handle)
          }
        >
          <Heading size='sm' as='h4'>
            {product.title}
          </Heading>
        </LinkOverlay>
        {product.variantTitle && product.variantTitle !== 'Default Title' ? (
          <Heading size='sm' fontWeight='light'>
            {product.variantTitle}
          </Heading>
        ) : (
          <></>
        )}
        <Text fontSize='sm' color='brand-primary.500'>
          {getPriceText(product)}
        </Text>
      </Box>
    </LinkBox>
  );
};

export default SingleProduct;
