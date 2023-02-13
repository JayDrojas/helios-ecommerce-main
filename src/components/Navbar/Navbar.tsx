import DesktopNavbar from './DesktopNavbar';
import MobileNavbar from './MobileNavbar';
import { useState } from 'react';
import type { NavbarContentFromQuery } from '@/lib/interfaces';
import { useQuery } from '@apollo/client';
import { NavbarDocument } from '@/graphql/contentful';
import useLocale from '@/lib/utils/hooks/useLocale';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Spacer,
  useMediaQuery
} from '@chakra-ui/react';
import { IoMdBicycle } from 'react-icons/io';
import AuthButtonAndPopover from './AuthButtonAndPopover';
import NextLink from 'next/link';

const homeHref = '/';

const Navbar = () => {
  const [isDesktop] = useMediaQuery('(min-width: 820px)');
  const [navbar, setNavbar] = useState<NavbarContentFromQuery | null>(null);
  const { locale } = useLocale();
  const { loading, error } = useQuery(NavbarDocument, {
    variables: {
      locale: locale
    },
    onCompleted: (data) => {
      if (data && data.navbarCollection?.items) {
        setNavbar(data.navbarCollection.items[0]);
      }
    }
  });

  if (!navbar || loading || error)
    return (
      <Box px={10} h={16}>
        <Flex alignItems={'center'} h='full'>
          <HStack spacing={4} h='full'>
            <IconButton
              href={homeHref}
              as={NextLink}
              color='brand-primary.400'
              fontSize='3xl'
              h='full'
              w={16}
              bg='none'
              aria-label='Homepage'
              variant='ghost'
              rounded='none'
              icon={<IoMdBicycle />}
            />
          </HStack>
          <Spacer />
          <HStack alignItems='center' h='full'>
            <AuthButtonAndPopover />
            <AuthButtonAndPopover />
          </HStack>
        </Flex>
      </Box>
    );

  return (
    <>
      {isDesktop ? (
        <DesktopNavbar navbar={navbar} />
      ) : (
        <MobileNavbar navbar={navbar} />
      )}
    </>
  );
};

export default Navbar;
