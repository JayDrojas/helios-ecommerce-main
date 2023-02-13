import {
  Button,
  Box,
  Center,
  Container,
  useMediaQuery,
  SlideFade
} from '@chakra-ui/react';
import { FooterDocument } from '@/graphql/contentful';
import type { FooterContentFromQuery } from '@/lib/interfaces';
import useLocale from '@/lib/utils/hooks/useLocale';
import { useQuery } from '@apollo/client';
import { useState } from 'react';
import DesktopFooter from './parts/DesktopFooter';
import MobileFooter from './parts/MobileFooter';
import { IoMdBicycle } from 'react-icons/io';
import NextLink from 'next/link';

const Footer = () => {
  const [isDesktop] = useMediaQuery('(min-width: 820px)');
  const [footer, setFooter] = useState<FooterContentFromQuery | null>(null);
  const { locale } = useLocale();
  const { loading, error } = useQuery(FooterDocument, {
    variables: {
      locale: locale,
      fetchPolicy: 'no-cache'
    },
    onCompleted: (data) => {
      if (data && data.footerCollection?.items) {
        setFooter(data.footerCollection.items[0]);
      }
    }
  });

  if (!footer || loading || error)
    return (
      <Box bgColor='gray.50' as='footer' py={24}>
        <Container>
          <Center>
            <Button href={'/'} variant='ghost' as={NextLink} h={'fit-content'}>
              <IoMdBicycle fontSize={96} />
            </Button>
          </Center>
        </Container>
      </Box>
    );

  return (
    <>
      <SlideFade unmountOnExit in={!!footer} offsetX={8} offsetY={0}>
        {isDesktop ? (
          <DesktopFooter footer={footer} />
        ) : (
          <MobileFooter footer={footer} />
        )}
      </SlideFade>
    </>
  );
};

export default Footer;
