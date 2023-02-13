import {
  Box,
  Flex,
  HStack,
  IconButton,
  Spacer,
  Button,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Container,
  SlideFade
} from '@chakra-ui/react';
import { IoMdBicycle } from 'react-icons/io';
import CartButtonAndPopover from '../../Cart';
import NextLink from 'next/link';
import AuthButtonAndPopover from '../AuthButtonAndPopover';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SearchIcon } from '@chakra-ui/icons';
import type { NavbarContentFromQuery } from '@/lib/interfaces';

const homeHref = '/';

interface Props {
  navbar: NavbarContentFromQuery;
}

const DesktopNavbar = ({ navbar }: Props) => {
  const router = useRouter();
  const [languageValue, setLanguageValue] = useState(router.locale);

  const onToggleLanguageClick = (newLocale: string) => {
    const { pathname, asPath, query } = router;
    setLanguageValue(newLocale === 'en' ? 'en' : 'es');
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  const { register, handleSubmit } = useForm<{
    search: string;
  }>();

  return (
    <Container px={4} h={16} maxW='container.xl'>
      <SlideFade in={!!navbar} unmountOnExit offsetX={8} offsetY={0}>
        <Flex alignItems={'center'} h={16}>
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
          <HStack as='nav' spacing={[0, 0, 1, 4]} h='full'>
            {navbar.navLinksCollection?.items.map((item, index) => (
              <Button
                key={`${item?.title}${index}`}
                href={item?.href ?? ''}
                as={NextLink}
                h={16}
                fontWeight='normal'
                fontSize='sm'
                variant='ghost'
                rounded='none'
              >
                {item?.title}
              </Button>
            ))}
          </HStack>
          <Spacer />
          <HStack h='full'>
            <Box>
              <form
                onSubmit={handleSubmit((ev) => {
                  if (!ev.search)
                    throw new Error('Search value was not provided.');
                  if (ev.search.trim() === '') return;
                  router.push({
                    pathname: '/search',
                    query: { q: ev.search.trim() }
                  });
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
            </Box>
            <Box h={16}>
              <CartButtonAndPopover />
            </Box>
            <Box h={16}>
              <AuthButtonAndPopover />
            </Box>
            <Box>
              <Select
                onChange={(e) => onToggleLanguageClick(e.target.value)}
                size='sm'
                fontSize='xs'
                value={languageValue}
                w={20}
                borderRadius='3xl'
                iconSize='xs'
              >
                <option value='en'>🇺🇸 EN</option>
                <option value='es'>🇲🇽 ES</option>
              </Select>
            </Box>
          </HStack>
        </Flex>
      </SlideFade>
    </Container>
  );
};

export default DesktopNavbar;
