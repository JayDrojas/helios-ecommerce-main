import { HamburgerIcon, SearchIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import React, { Fragment, useMemo, useRef, useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Box,
  IconButton,
  Select,
  VStack,
  Flex,
  useToast,
  Heading,
  HStack,
  Divider,
  InputGroup,
  Input,
  InputLeftElement
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import NextLink from 'next/link';
import { useShopifyAuth } from '@/components/ShopifyAuth/context/ShopifyAuthContext';
import { GetCustomerByAccessTokenDocument } from '@/graphql/shopify';
import { useQuery } from '@apollo/client';
import { z } from 'zod';
import { IoMdBicycle } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import type { NavbarContentFromQuery } from '@/lib/interfaces';

const popoverUserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  email: z.string()
});

const homeHref = '/';

interface Props {
  navbar: NavbarContentFromQuery;
}

const HamburgerMenu = ({ navbar }: Props) => {
  const toast = useToast();
  const router = useRouter();
  const [languageValue, setLanguageValue] = useState(router.locale);
  const { t } = useTranslation('common');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const {
    accessToken,
    processing,
    auth: { logout }
  } = useShopifyAuth();

  const { data, loading } = useQuery(GetCustomerByAccessTokenDocument, {
    variables: { accessToken: accessToken?.accessToken ?? '' },
    skip: !accessToken || processing
  });

  const userData = useMemo(() => {
    try {
      return popoverUserSchema.parse(data?.customer);
    } catch {
      return null;
    }
  }, [data]);

  const onToggleLanguageClick = (newLocale: string) => {
    const { pathname, asPath, query } = router;
    setLanguageValue(newLocale === 'en' ? 'en' : 'es');
    router.push({ pathname, query }, asPath, { locale: newLocale });
    onClose();
  };

  const { register, handleSubmit } = useForm<{
    search: string;
  }>();

  return (
    <>
      <HamburgerIcon onClick={onOpen} />
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
        size='xs'
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {' '}
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
          </DrawerHeader>

          <DrawerBody>
            <Flex
              alignItems='center'
              justifyContent='space-between'
              flexDirection='column'
              height='full'
              w='full'
            >
              <VStack height='min-content' w='full'>
                <form
                  onSubmit={handleSubmit((ev) => {
                    if (!ev.search)
                      throw new Error('Search value was not provided.');
                    if (ev.search.trim() === '') return;
                    router.push({
                      pathname: '/search',
                      query: { q: ev.search.trim() }
                    });
                    onClose();
                  })}
                >
                  <InputGroup mr={4}>
                    <InputLeftElement
                      pointerEvents='none'
                      color='black'
                      alignItems='center'
                      fontSize='sm'
                      paddingBottom={1.5}
                    >
                      <SearchIcon />
                    </InputLeftElement>
                    <Input
                      {...register('search', { required: true })}
                      size='sm'
                      bg='gray.50'
                      placeholder='Search'
                    />
                  </InputGroup>
                </form>
                <Divider />
                {navbar.navLinksCollection?.items.map((item, index) => (
                  <React.Fragment key={`${item?.title}${index}`}>
                    <Button
                      href={item?.href ?? ''}
                      as={NextLink}
                      fontWeight='normal'
                      fontSize='sm'
                      variant='ghost'
                      rounded='none'
                      onClick={onClose}
                      w='full'
                    >
                      {item?.title}
                    </Button>
                    <Divider />
                  </React.Fragment>
                ))}
                <Button
                  href={'/account'}
                  as={NextLink}
                  fontWeight='normal'
                  fontSize='sm'
                  variant='ghost'
                  rounded='none'
                  onClick={onClose}
                  w='full'
                >
                  {t('navbar.account')}
                </Button>
                <Divider />
              </VStack>
              <VStack>
                {accessToken && userData ? (
                  <>
                    <Heading as='h2' size='lg' mt={6}>
                      {t('navbar.account')}
                    </Heading>
                    <VStack mb='8'>
                      <Heading fontWeight='normal' as='h3' size='sm' mb='2'>
                        {userData.displayName}
                      </Heading>
                      <Heading fontWeight='normal' as='h3' size='sm' mb='2'>
                        {userData.email}
                      </Heading>
                    </VStack>
                    <Divider />
                    <Button
                      onClick={() =>
                        logout().then(() =>
                          toast({
                            title: t('authmessages.logout'),
                            description: t('authmessages.logout-desc'),
                            status: 'success'
                          })
                        )
                      }
                    >
                      {t('buttons.logout-bttn')}
                    </Button>
                  </>
                ) : (
                  <HStack w='full' py='2'>
                    <Button
                      href='/auth/signup'
                      as={NextLink}
                      fontWeight='normal'
                      fontSize='sm'
                      variant='ghost'
                      rounded='none'
                      onClick={onClose}
                      w='full'
                    >
                      {t('buttons.signup-bttn')}
                    </Button>
                    <Divider orientation='vertical' />
                    <Button
                      href='/auth/login'
                      as={NextLink}
                      fontWeight='normal'
                      fontSize='sm'
                      variant='ghost'
                      rounded='none'
                      onClick={onClose}
                      w='full'
                    >
                      {t('buttons.login-bttn')}
                    </Button>
                  </HStack>
                )}
              </VStack>
            </Flex>
          </DrawerBody>

          <DrawerFooter>
            <Box m='auto'>
              <Select
                onChange={(e) => onToggleLanguageClick(e.target.value)}
                size='sm'
                fontSize='xs'
                value={languageValue}
                w={40}
                borderRadius='3xl'
                iconSize='xs'
                textAlign='center'
              >
                <option value='en'>English 🇺🇸</option>
                <option value='es'>Spanish 🇲🇽</option>
              </Select>
            </Box>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default HamburgerMenu;
