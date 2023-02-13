import { useShopifyAuth } from '@/components/ShopifyAuth/context/ShopifyAuthContext';
import {
  GetCustomerByAccessTokenQuery,
  CustomerUpdateDocument,
  GetCustomerByAccessTokenDocument
} from '@/graphql/shopify';
import apollo from '@/lib/clients/apollo';
import {
  Button,
  VStack,
  useToast,
  Box,
  Flex,
  Skeleton
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { z } from 'zod';
import { updateCustomerFormSchema } from '../../schemas';
import UpdateEmailForm from './parts/UpdateEmailForm';
import UpdateNameForm from './parts/UpdateNameForm';
import UpdatePasswordForm from './parts/UpdatePasswordForm';

interface Props {
  user: GetCustomerByAccessTokenQuery['customer'];
  setUser: Dispatch<SetStateAction<GetCustomerByAccessTokenQuery['customer']>>;
}

const InfoTabBody = ({ user, setUser }: Props) => {
  const { accessToken } = useShopifyAuth();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation('common');

  // Had to create my own type to satisfy the shopify type
  const defaultValues: {
    firstName: string;
    lastName: string;
    email: string;
    acceptsMarketing: boolean;
    phone: string | null | undefined;
    password: string | null;
  } = {
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    acceptsMarketing: false,
    phone: user?.phone ?? null,
    password: null
  };

  const updateCustomerForm = useForm<z.infer<typeof updateCustomerFormSchema>>({
    resolver: zodResolver(updateCustomerFormSchema),
    defaultValues
  });

  useEffect(() => {
    // Needed to add this useEffect to reset the form to the new values after updating name
    if (user) {
      updateCustomerForm.reset({
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        email: user?.email ?? '',
        acceptsMarketing: false,
        phone: user?.phone ?? null,
        password: null
      });
    }
  }, [user]);

  const onSubmit: SubmitHandler<z.infer<typeof updateCustomerFormSchema>> = (
    formInput
  ) => {
    (async () => {
      setLoading(true);
      try {
        const parsedFormInput = updateCustomerFormSchema.parse(formInput);
        const { data, errors } = await apollo.mutate({
          mutation: CustomerUpdateDocument,
          variables: {
            customer: {
              ...parsedFormInput
            },
            customerAccessToken: accessToken?.accessToken
              ? accessToken.accessToken
              : ''
          },
          refetchQueries: () => [
            {
              query: GetCustomerByAccessTokenDocument,
              variables: {
                accessToken: accessToken ? accessToken.accessToken : ''
              }
            }
          ]
        });

        if (errors && errors.length && !data) {
          console.log(errors);
          throw new Error('Something went wrong');
        }

        if (
          data?.customerUpdate?.customerUserErrors &&
          data.customerUpdate.customerUserErrors.length > 0
        ) {
          const messages = data.customerUpdate.customerUserErrors
            .map((error) => {
              if (error.code === 'TAKEN') {
                throw new Error(
                  'This address is already in your saved address.'
                );
              } else {
                return error.message;
              }
            })
            .join(' ');

          throw new Error(messages);
        }

        if (data?.customerUpdate?.customer) {
          toast({
            title: t('authmessages.customer-update-success'),
            description: t('authmessages.customer-update-success-desc'),
            status: 'success',
            isClosable: true
          });
        }
      } catch (error) {
        toast({
          title: t('authmessages.basic-error-message'),
          description: t('authmessages.basic-error-message-desc'),
          status: 'error',
          isClosable: true
        });
        updateCustomerForm.reset();
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <>
      <Flex w='full' flexDirection='column' pt={16}>
        <form onSubmit={updateCustomerForm.handleSubmit(onSubmit)}>
          <VStack gap={4}>
            <Skeleton isLoaded={!loading} w='full'>
              <UpdateNameForm
                user={user}
                updateCustomerForm={updateCustomerForm}
              />
            </Skeleton>
            <UpdateEmailForm
              user={user}
              updateCustomerForm={updateCustomerForm}
            />
            <UpdatePasswordForm
              user={user}
              updateCustomerForm={updateCustomerForm}
            />
          </VStack>
          <Box textAlign='right'>
            <Button
              isLoading={loading}
              loadingText='Saving'
              type='submit'
              colorScheme='brand-primary'
              mt={4}
            >
              {t('auth-forms.buttons.save')}
            </Button>
          </Box>
        </form>
      </Flex>
    </>
  );
};

export default InfoTabBody;
