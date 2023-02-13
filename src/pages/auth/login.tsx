import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
  VStack
} from '@chakra-ui/react';
import Head from 'next/head';
import { SubmitHandler, useForm } from 'react-hook-form';
import NextLink from 'next/link';
import { loginFormSchema } from '@/components/ShopifyAuth/schemas';
import { useShopifyAuth } from '@/components/ShopifyAuth/context/ShopifyAuthContext';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import type { GetServerSideProps } from 'next';

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

const Login = () => {
  const { promise } = useToast();
  const { push } = useRouter();
  const { t } = useTranslation('common');

  const {
    accessToken,
    auth: { login },
    processing
  } = useShopifyAuth();

  const toast = useToast();
  const isInitialized = useRef<boolean>(false);
  useEffect(() => {
    if (isInitialized.current) return;
    if (accessToken) {
      toast({
        title: t('authmessages.customer-signedin-message'),
        description: t('authmessages.redirect-homepage-message'),
        duration: 3000
      });
      push('/');
    }
    if (!processing) {
      isInitialized.current = true;
    }
  }, [isInitialized, accessToken, toast, push]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema)
  });

  const onSubmit: SubmitHandler<z.infer<typeof loginFormSchema>> = (
    formInput
  ) => {
    promise(
      (async () => {
        if (processing) throw new Error('Still processing...');
        try {
          const parsedFormInput = loginFormSchema.parse(formInput);
          await login(parsedFormInput);
        } catch (err: any) {
          throw err;
        }
      })(),
      {
        loading: {
          title: t('authmessages.processing')
        },
        success: (result) => {
          reset();
          push('/');
          return {
            title: t('authmessages.success'),
            description: t('authmessages.login-success')
          };
        },
        error: (err) => {
          if (err?.cause === 'CUSTOMER_DISABLED') {
            return {
              title: t('authmessages.customer-disabled-message'),
              description: err.message
            };
          }
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
        <title>{t('login-page.title')}</title>
      </Head>
      <Center>
        <Box w='lg' py={8}>
          <Stack>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex direction='column' gap={4}>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel>{t('login-page.email')}</FormLabel>
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
                  <FormLabel>{t('login-page.password')}</FormLabel>
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
                  {t('buttons.login-bttn')}
                </Button>
              </Flex>
            </form>
          </Stack>

          <VStack py={8}>
            <Flex alignItems='center'>
              <Text lineHeight='tall' fontSize='sm'>
                {t('login-page.signup-message')}
              </Text>
              <Button
                href='/auth/signup'
                as={NextLink}
                p='2'
                bgColor='transparent'
                type='button'
              >
                {t('buttons.signup-bttn')}
              </Button>
            </Flex>
          </VStack>
        </Box>
      </Center>
    </>
  );
};

export default Login;
