import {
  Box,
  Flex,
  IconButton,
  HStack,
  SlideFade,
  Container
} from '@chakra-ui/react';
import { IoMdBicycle } from 'react-icons/io';
import NextLink from 'next/link';
import CartButtonAndPopover from '../../Cart';
import HamburgerMenu from './parts/HamburgerMenu/HamburgerMenu';
import type { NavbarContentFromQuery } from '@/lib/interfaces';

const homeHref = '/';

interface Props {
  navbar: NavbarContentFromQuery;
}

const MobileNavbar = ({ navbar }: Props) => {
  return (
    <SlideFade in={!!navbar} unmountOnExit offsetX={8} offsetY={0}>
      <Container px={4} h={16} maxW='container.xl'>
        <Box px={4} h={16} w='full'>
          <Flex
            alignItems={'center'}
            justifyContent='space-between'
            h='full'
            w='full'
          >
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
            <HStack spacing={6} h='full' w='fit-content'>
              <CartButtonAndPopover />
              <HamburgerMenu navbar={navbar} />
            </HStack>
          </Flex>
        </Box>
      </Container>
    </SlideFade>
  );
};

export default MobileNavbar;
