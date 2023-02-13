import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon
} from '@chakra-ui/icons';
import { AspectRatio, Box, Flex, Grid, Image } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import overflow from './Overflow.module.css';

interface Props {
  images: {
    __typename?: 'Image' | undefined;
    id: string | null;
    url: string;
    altText: string | null;
  }[];
  direction: string;
  changeImage: (idx: number) => void;
  isLessThan800: boolean;
}

const ImageSelection = ({
  images,
  direction,
  changeImage,
  isLessThan800
}: Props) => {
  return (
    <Box>
      {isLessThan800 ? (
        <HorizontalImages
          changeImage={changeImage}
          images={images}
          direction={direction}
          isLessThan800={isLessThan800}
        />
      ) : (
        <VerticalImages
          changeImage={changeImage}
          images={images}
          direction={direction}
          isLessThan800={isLessThan800}
        />
      )}
    </Box>
  );
};

export default ImageSelection;

const VerticalImages = ({ images, changeImage }: Props) => {
  const contentWrapper = useRef<HTMLDivElement | null>(null);
  const [scrollInfo, setScrollInfo] = useState({
    items: images,
    hasOverflow: false,
    canScrollTop: false,
    canScrollBottom: false
  });

  function checkForScrollPosition() {
    if (!contentWrapper.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentWrapper.current;

    return setScrollInfo({
      ...scrollInfo,
      canScrollTop: scrollTop > 0,
      canScrollBottom: scrollTop !== scrollHeight - clientHeight
    });
  }

  function checkForOverflow() {
    if (!contentWrapper.current) return false;
    const { scrollHeight, clientHeight } = contentWrapper.current;
    const hasOverflow = scrollHeight > clientHeight;

    return setScrollInfo({ ...scrollInfo, hasOverflow });
  }

  function scrollContainerBy(distance: number) {
    if (!contentWrapper.current) return;
    contentWrapper.current.scrollBy({ top: distance, behavior: 'smooth' });
  }

  useEffect(() => {
    checkForOverflow();
    checkForScrollPosition();
    contentWrapper.current?.addEventListener('scroll', checkForScrollPosition);
  }, []);

  return (
    <Flex flexDirection='column' w='5em'>
      <ChevronUpIcon
        onClick={() => scrollContainerBy(-200)}
        w={8}
        height={10}
        m={'auto'}
        as='button'
        disabled={!scrollInfo.canScrollTop}
        _disabled={{ visibility: 'hidden' }}
      />
      <Box
        flex='auto'
        height='lg'
        overflowY='scroll'
        className={overflow.maskedOverflowVertical}
        ref={contentWrapper}
        css={{
          msOverflowStyle: 'none',
          '::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        <Grid gridAutoFlow={{ base: 'column', md: 'row' }} gap={4}>
          {images.map((item, idx) => (
            <AspectRatio ratio={1} key={idx}>
              <Box
                aria-label={`Switch to image ${idx}`}
                _hover={{
                  backgroundColor: 'blackAlpha.400'
                }}
                onClick={() => changeImage(idx)}
                backgroundBlendMode='darken'
                backgroundImage={item.url}
                backgroundSize='cover'
                as='button'
                w='full'
                h='48'
                display='block'
              />
            </AspectRatio>
          ))}
        </Grid>
      </Box>
      <ChevronDownIcon
        onClick={() => scrollContainerBy(200)}
        w={8}
        height={10}
        m={'auto'}
        as='button'
        disabled={!scrollInfo.canScrollBottom}
        _disabled={{ visibility: 'hidden' }}
      />
    </Flex>
  );
};

const HorizontalImages = ({ images, changeImage }: Props) => {
  const contentWrapper = useRef<HTMLDivElement | null>(null);

  const [scrollInfo, setScrollInfo] = useState({
    items: images,
    hasOverflow: false,
    canScrollLeft: false,
    canScrollRight: false
  });

  function checkForScrollPosition() {
    if (!contentWrapper.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = contentWrapper.current;

    return setScrollInfo({
      ...scrollInfo,
      canScrollLeft: scrollLeft > 0,
      canScrollRight: scrollLeft !== scrollWidth - clientWidth
    });
  }

  function checkForOverflow() {
    if (!contentWrapper.current) return false;
    const { scrollWidth, clientWidth } = contentWrapper.current;
    const hasOverflow = scrollWidth > clientWidth;

    return setScrollInfo({ ...scrollInfo, hasOverflow });
  }

  function scrollContainerBy(distance: number) {
    if (!contentWrapper.current) return;
    contentWrapper.current.scrollBy({ left: distance, behavior: 'smooth' });
  }

  useEffect(() => {
    checkForOverflow();
    checkForScrollPosition();
    contentWrapper.current?.addEventListener('scroll', checkForScrollPosition);
  }, []);

  return (
    <Flex justifyContent='center' alignItems='center'>
      <ChevronLeftIcon
        w={8}
        height={10}
        onClick={() => scrollContainerBy(-200)}
        as='button'
        disabled={!scrollInfo.canScrollLeft}
        _disabled={{ visibility: 'hidden' }}
      />
      <Flex
        gap={4}
        w='full'
        h='full'
        css={{
          msOverflowStyle: 'none',
          '::-webkit-scrollbar': {
            display: 'none'
          }
        }}
        className={overflow.maskedOverflowHorizontal}
        ref={contentWrapper}
      >
        {images.map((item, idx) => (
          <Box key={item.url} w={'min-content'} h={'min-content'}>
            <Image
              aria-label={`Switch to image ${idx}`}
              _hover={{
                backgroundColor: 'blackAlpha.400'
              }}
              onClick={() => changeImage(idx)}
              backgroundBlendMode='darken'
              backgroundImage={item.url}
              backgroundSize='cover'
              backgroundPosition='center'
              backgroundRepeat='no-repeat'
              as='button'
              boxSize='4em'
              loading='lazy'
            />
          </Box>
        ))}
      </Flex>
      <ChevronRightIcon
        w={8}
        height={10}
        onClick={() => scrollContainerBy(200)}
        as='button'
        disabled={!scrollInfo.canScrollRight}
        _disabled={{ visibility: 'hidden' }}
      />
    </Flex>
  );
};
