import {
  Stack,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Center,
  Box,
  VStack,
  FormErrorMessage,
  useToast
} from '@chakra-ui/react';
import Head from 'next/head';
import { SubmitHandler, useForm } from 'react-hook-form';
import NextLink from 'next/link';
import { signupFormSchema } from '@/components/ShopifyAuth/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShopifyAuth } from '@/components/ShopifyAuth/context/ShopifyAuthContext';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import type { z } from 'zod';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  try {
    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'en', ['common']))
      }
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
};

const Signup = () => {
  const { promise } = useToast();
  const { push } = useRouter();
  const { t } = useTranslation('common');

  const {
    auth: { signup },
    processing,
    accessToken
  } = useShopifyAuth();

  const toast = useToast();
  const initializedRef = useRef<boolean>(false);
  useEffect(() => {
    if (initializedRef.current) return;
    if (accessToken) {
      toast({
        title: t('authmessages.customer-signedin-message'),
        description: 'Redirecting to home page...',
        duration: 3000
      });
      push('/');
    }
    if (!processing) {
      initializedRef.current = true;
    }
  }, [initializedRef, accessToken, toast, push]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema)
  });

  const onSubmit: SubmitHandler<z.infer<typeof signupFormSchema>> = (
    formInput
  ) => {
    promise(
      (async () => {
        if (processing || !initializedRef.current)
          throw new Error('Still processing...');
        try {
          const parsedFormInput = signupFormSchema.parse(formInput);
          await signup(parsedFormInput);
        } catch (err: unknown) {
          console.error(err);
          if (err instanceof Error) {
            if (err.cause === 'CUSTOMER_DISABLED')
              return {
                cause: err.cause,
                message: err.message
              };
          }
          throw err;
        }
      })(),
      {
        loading: {
          title: t('authmessages.processing')
        },
        success: (result) => {
          reset();
          push('/auth/login');
          if (result?.cause === 'CUSTOMER_DISABLED') {
            return {
              title: t('authmessages.customer-disabled-message'),
              description: result.message
            };
          }
          return {
            title: t('authmessages.success'),
            description: t('authmessages.success-description')
          };
        },
        error: (err) => {
          return {
            title: err.name,
            description: err.message
          };
        }
      }
    );
  };

  return (
    <>
      <Head>
        <title>{t('signup-page.title')}</title>
      </Head>
      <Center>
        <Box w='lg' py={8}>
          <Stack>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex direction='column' gap={4}>
                <FormControl isInvalid={!!errors.firstName}>
                  <FormLabel>{t('signup-page.first-name')}</FormLabel>
                  <Input bgColor='gray.100' {...register('firstName')} />
                  <FormErrorMessage>
                    {errors.firstName && errors.firstName.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.lastName}>
                  <FormLabel>{t('signup-page.last-name')}</FormLabel>
                  <Input bgColor='gray.100' {...register('lastName')} />
                  <FormErrorMessage>
                    {errors.lastName && errors.lastName.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel>{t('signup-page.email')}</FormLabel>
                  <Input
                    bgColor='gray.100'
                    type='email'
                    {...register('email')}
                  />
                  <FormErrorMessage>
                    {errors.email && errors.email.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.password}>
                  <FormLabel>{t('signup-page.password')}</FormLabel>
                  <Input
                    bgColor='gray.100'
                    {...register('password')}
                    type='password'
                  />
                  <FormErrorMessage>
                    {errors.password && errors.password.message}
                  </FormErrorMessage>
                </FormControl>
                <Button
                  mt={4}
                  size='lg'
                  type='submit'
                  colorScheme='brand-primary'
                  disabled={processing}
                >
                  {t('buttons.create-account-bttn')}
                </Button>
              </Flex>
            </form>
          </Stack>
          <Center>
            <VStack>
              <Flex alignItems='center' py={8}>
                <Text lineHeight='tall' fontSize='sm'>
                  {t('signup-page.login-message')}
                </Text>
                <Button
                  as={NextLink}
                  href='/auth/login'
                  p='2'
                  bgColor='transparent'
                  type='button'
                >
                  {t('buttons.login-bttn')}
                </Button>
              </Flex>
            </VStack>
          </Center>
        </Box>
      </Center>
    </>
  );
};

export default Signup;
