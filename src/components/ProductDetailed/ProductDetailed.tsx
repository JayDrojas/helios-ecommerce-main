import { useEffect, useMemo, useState } from 'react';
import type { ProductDetailedQuery } from '@/graphql/shopify';
import {
  Box,
  Center,
  Container,
  Flex,
  Heading,
  Image,
  Skeleton,
  useMediaQuery
} from '@chakra-ui/react';
import AddCartForm from '@/components/ProductDetailed/AddCartForm';
import ProductTabs from '@/components/ProductDetailed/ProductTabs';
import { useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/router';
import transformOptionsToInput from '@/lib/utils/transform-options/transformOptionsToInput';
import ImageSelection from './ImageSelection';
interface Props {
  productHandle: string;
  productData: ProductDetailedQuery | undefined;
}

const ProductDetailed = ({ productHandle, productData }: Props) => {
  const router = useRouter();
  const [currImageIdx, setCurrImage] = useState(0);
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [currentImages, setCurrentImages] = useState<
    {
      __typename?: 'Image' | undefined;
      id: string | null;
      url: string;
      altText: string | null;
    }[]
  >(productData?.product?.images.nodes ? productData.product.images.nodes : []);
  const [isLessThan800] = useMediaQuery('(max-width: 767px)', {
    ssr: true,
    fallback: false // return false on the server, and re-evaluate on the client side
  });
  const defaultValues = productData?.product?.options?.reduce(
    (options: { [key: string]: string }, option) => {
      options[option.name] = option.values[0];
      return options;
    },
    {} as { [key: string]: string }
  );

  const form = useForm({
    defaultValues
  });

  const selectedOptions = useWatch({ control: form.control });

  const [ready, setReady] = useState(false);

  /** Load variant from URL on page load, if any. */
  useEffect(() => {
    try {
      const { variant } = router.query;
      if (typeof variant !== 'string') return;
      if (!productData?.product?.variants.nodes) return;
      const foundVariant = productData.product.variants.nodes.find(
        (productVariant) => {
          return productVariant.id === variant;
        }
      );
      if (!foundVariant) {
        console.error('this variant does not exist');
        return;
      }
      foundVariant.selectedOptions.forEach((option) => {
        form.setValue(option.name, option.value);
      });
    } finally {
      setReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const variantData = useMemo(() => {
    if (!productData?.product?.variants.nodes || !ready) {
      return null;
    }
    const variantData = productData.product.variants.nodes.find((candidate) => {
      const desiredOptions = transformOptionsToInput(
        selectedOptions as {
          [key: string]: string;
        }
      );
      const isValid = candidate.selectedOptions.reduce((isValid, candidate) => {
        if (!isValid) return false;
        return !!desiredOptions.find((e) => {
          return e.name === candidate.name && e.value === candidate.value;
        });
      }, true);
      return isValid;
    });

    if (!variantData) console.error('this variant was not found');

    router.replace({
      ...router,
      query: { ...router.query, variant: variantData?.id }
    });

    setCurrImage(0);
    if (variantData?.metafield?.references?.nodes) {
      const images = variantData.metafield.references.nodes
        .filter((element) => {
          if (element.__typename === 'MediaImage') return true;
          return false;
        })
        .map((node) => {
          if (node.__typename !== 'MediaImage')
            throw new Error("This shouldn't happen...");
          if (!node.image?.id || !node.image.url)
            throw new Error("Image doesn't have a URL or ID?");
          return node.image;
        });
      setCurrentImages(images);
    } else {
      const images = productData?.product?.images.nodes
        .filter((element) => {
          if (element.__typename === 'Image') return true;
          return false;
        })
        .map((node) => {
          if (node.__typename !== 'Image')
            throw new Error("This shouldn't happen...");
          if (!node?.id || !node.url)
            throw new Error("Image doesn't have a URL or ID?");
          return node;
        });
      setCurrentImages(images ?? []);
    }

    return variantData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData, selectedOptions, ready]);

  const getCurrImage = (idx: number) => {
    return currentImages[idx];
  };

  const changeImage = (idx: number) => {
    setImageLoading(true);
    setCurrImage(idx);
  };

  return (
    <>
      <Container maxW='container.xl' pb={24}>
        <Flex py={16} flexDirection={{ base: 'column', md: 'row' }} gap={8}>
          {isLessThan800 ? (
            <></>
          ) : (
            <ImageSelection
              direction='vertical'
              images={currentImages}
              changeImage={changeImage}
              isLessThan800={isLessThan800}
            />
          )}
          <Box flex='6'>
            <Center p={[0, 8]}>
              <Skeleton isLoaded={!imageLoading}>
                <Image
                  onLoad={() => setImageLoading(false)}
                  h='lg'
                  w='lg'
                  objectFit={'contain'}
                  src={getCurrImage(currImageIdx)?.url}
                  alt={getCurrImage(currImageIdx)?.altText ?? ''}
                />
              </Skeleton>
            </Center>
          </Box>
          {isLessThan800 ? (
            <ImageSelection
              changeImage={changeImage}
              direction='horizontal'
              images={currentImages}
              isLessThan800={isLessThan800}
            />
          ) : (
            <></>
          )}
          <Box flex='5'>
            <Heading mt={4} as='h1' size='lg'>
              {productData?.product?.title}
            </Heading>
            <AddCartForm
              options={productData?.product?.options}
              productHandle={productHandle}
              variantData={variantData}
              form={form}
            />
          </Box>
        </Flex>
        <ProductTabs
          description={productData?.product?.description}
          variantData={variantData}
          shippingData={productData?.product?.metafields[0]}
        />
      </Container>
    </>
  );
};

export default ProductDetailed;
