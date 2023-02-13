import { useShopifyAuth } from '@/components/ShopifyAuth/context/ShopifyAuthContext';
import {
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  useDisclosure,
  Heading,
  Button,
  VStack,
  Divider,
  Box,
  Skeleton,
  useToast
} from '@chakra-ui/react';
import { RiUserLine } from 'react-icons/ri';
import { useQuery } from '@apollo/client';
import { GetCustomerByAccessTokenDocument } from '@/graphql/shopify';
import { z } from 'zod';
import { useMemo } from 'react';
import NextLink from 'next/link';
import { useTranslation } from 'react-i18next';

const popoverUserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  email: z.string()
});

const AuthButtonAndPopover = () => {
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { t } = useTranslation('common');
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

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      placement='bottom-end'
      closeOnBlur
      closeOnEsc
    >
      <PopoverTrigger>
        <IconButton
          onClick={onOpen}
          h='full'
          color='black'
          aria-label='profile'
          icon={<RiUserLine />}
          variant='ghost'
          cursor='pointer'
          rounded='none'
        />
      </PopoverTrigger>
      <PopoverContent w='sm'>
        <PopoverArrow />
        <PopoverCloseButton onClick={onClose} />

        <Skeleton isLoaded={!loading} p={4}>
          {accessToken && userData ? (
            <>
              <PopoverBody>
                <Box mb='8'>
                  <Heading fontWeight='bold' size='md' mb='2'>
                    {userData.displayName}
                  </Heading>
                  <Heading fontWeight='normal' as='h3' size='sm' mb='2'>
                    {userData.email}
                  </Heading>
                </Box>
                <VStack alignItems='start' w='full'>
                  <Button
                    justifyContent='left'
                    as={NextLink}
                    href='/account'
                    variant='ghost'
                    w='full'
                    onClick={onClose}
                  >
                    {t('account.my-account')}
                  </Button>
                  <Divider />
                  <Button
                    as='a'
                    variant='ghost'
                    w='full'
                    justifyContent='left'
                    onClick={() => {
                      logout().then(() => {
                        toast({
                          title: t('authmessages.logout'),
                          description: t('authmessages.logout-desc'),
                          status: 'success'
                        });
                        onClose();
                      });
                    }}
                  >
                    {t('buttons.logout-bttn')}
                  </Button>
                </VStack>
              </PopoverBody>
            </>
          ) : (
            <>
              <PopoverBody>
                <Heading size='md' mb='2'>
                  {t('auth-button-popover.not-loggedin-message')}
                </Heading>
                <VStack w='full' py='2'>
                  <Button
                    href='/auth/signup'
                    onClick={onClose}
                    as={NextLink}
                    w='full'
                  >
                    {t('buttons.signup-bttn')}
                  </Button>
                  <Button
                    href='/auth/login'
                    onClick={onClose}
                    as={NextLink}
                    w='full'
                  >
                    {t('buttons.login-bttn')}
                  </Button>
                </VStack>
              </PopoverBody>
            </>
          )}
        </Skeleton>
      </PopoverContent>
    </Popover>
  );
};

export default AuthButtonAndPopover;
