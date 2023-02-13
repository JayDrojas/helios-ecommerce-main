import {
  useState,
  useContext,
  createContext,
  useCallback,
  useEffect
} from 'react';
import type { loginFormSchema, signupFormSchema } from '../schemas';
import type { z } from 'zod';
import apollo from '@/lib/clients/apollo';
import {
  CustomerAccessToken,
  CustomerLoginDocument,
  CustomerLogoutDocument,
  CustomerSignupDocument,
  CustomerValidateAndRenewDocument
} from '@/graphql/shopify';
import useMountEffect from '@/lib/utils/hooks/useMountEffect';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const StillProcessingError = new Error(
  'Currently processing, unable to proceed.'
);

const processingFunction = () => {
  throw StillProcessingError;
};
const key = 'shopify_access_token';

export function useShopifyAuthClientGenerator() {
  const [accessToken, setAccessToken] = useState<CustomerAccessToken | null>(
    null
  );

  /** Processing is true whenever something asynchronous is happening. */
  const [processing, setProcessing] = useState<boolean>(true);
  /** Initialized is false only until useMountEffect is completed. */
  const [initialized, setInitialized] = useState<boolean>(false);

  /** Check for token in local storage and validate it */
  useMountEffect(() => {
    (async () => {
      setProcessing(true);
      try {
        const value = localStorage.getItem(key);
        if (!value) {
          return;
        }
        let parsed: CustomerAccessToken;
        try {
          parsed = JSON.parse(value);
        } catch (err) {
          localStorage.removeItem(key);
          throw new Error(
            'Invalid auth token format, deleting from local storage.'
          );
        }

        console.log('Found an access token in local storage!', parsed);

        const { data, errors } = await apollo.mutate({
          mutation: CustomerValidateAndRenewDocument,
          variables: {
            accessToken: parsed.accessToken
          }
        });

        if (errors) {
          console.error(errors);
          return;
        }
        const accessToken = data?.customerAccessTokenRenew?.customerAccessToken;
        if (!accessToken) {
          console.error(
            'Unable to renew access token. Either it expired, or is invalid. Please login again.'
          );
          return;
        }
        console.log('Access token renewed!', accessToken);
        setAccessToken(accessToken);
      } finally {
        setProcessing(false);
        setInitialized(true);
      }
    })();
  });

  /** Keep localStorage in sync with accessToken */
  useEffect(() => {
    if (accessToken && initialized) {
      localStorage.setItem(key, JSON.stringify(accessToken));
    } else {
      localStorage.removeItem(key);
    }
  }, [accessToken, initialized]);

  /** Attempt sign up for a Shopify account, given input. Async. */
  const signup = useCallback(
    async (input: z.infer<typeof signupFormSchema>) => {
      if (processing) {
        throw StillProcessingError;
      } else setProcessing(true);
      try {
        const { data, errors } = await apollo.mutate({
          mutation: CustomerSignupDocument,
          variables: {
            input: {
              ...input,
              acceptsMarketing: false,
              phone: null
            }
          }
        });

        if (errors || !data?.customerCreate) {
          console.error(errors);
          throw new Error('An unexpected error occured.');
        }

        if (data.customerCreate.customerUserErrors.length > 1) {
          console.error(data.customerCreate.customerUserErrors);
          throw new Error(
            data.customerCreate.customerUserErrors
              .map((e) => e.message)
              .join(', ')
          );
        }

        const singleError = data.customerCreate.customerUserErrors[0];

        if (!!singleError?.message) {
          throw new Error(singleError.message as string, {
            cause: singleError.code
          });
        }

        const id = data.customerCreate.customer?.id;

        if (!id) {
          throw new Error('An unexpected error occured');
        }

        console.log('signup successful! id:', id);
      } finally {
        setProcessing(false);
      }
    },
    [processing]
  );

  /** Attempt to log into account, given credentials. Async. */
  const login = useCallback(
    async (input: z.infer<typeof loginFormSchema>) => {
      if (processing) {
        throw StillProcessingError;
      } else setProcessing(true);
      try {
        const { data, errors } = await apollo.mutate({
          mutation: CustomerLoginDocument,
          variables: {
            email: input.email,
            password: input.password
          }
        });

        if (errors || !data?.customerAccessTokenCreate) {
          console.error(errors);
          throw new Error('An unexpected error occured.');
        }

        if (data.customerAccessTokenCreate.customerUserErrors.length > 1) {
          console.error(data.customerAccessTokenCreate.customerUserErrors);
          throw new Error(
            data.customerAccessTokenCreate.customerUserErrors
              .map((e) => e.message)
              .join(', ')
          );
        }

        const singleError =
          data.customerAccessTokenCreate.customerUserErrors[0];

        if (!!singleError?.message) {
          throw new Error(singleError.message as string, {
            cause: singleError.code
          });
        }

        const accessToken = data.customerAccessTokenCreate.customerAccessToken;

        if (!accessToken) {
          throw new Error('An unexpected error occured');
        }

        console.log('login successful! access token:', accessToken);
        setAccessToken(accessToken);
      } finally {
        setProcessing(false);
      }
    },
    [processing]
  );

  /** Attempt a logout. Async. */
  const logout = useCallback(async () => {
    if (processing) {
      throw StillProcessingError;
    } else setProcessing(true);
    try {
      if (!accessToken?.accessToken)
        throw new Error('Not logged in currently (attempted to log out).');
      const { data, errors } = await apollo.mutate({
        mutation: CustomerLogoutDocument,
        variables: { accessToken: accessToken.accessToken }
      });
      if (errors) {
        console.error(errors);
        throw new Error('An unexpected error occured.');
      }
      if (!data?.customerAccessTokenDelete) {
        throw new Error(
          'An unexpected error occured. (Data from request is nonexistant.)'
        );
      }

      if (data.customerAccessTokenDelete.userErrors.length > 0) {
        console.error(data.customerAccessTokenDelete.userErrors);
        throw new Error('Something went wrong.');
      }

      if (!data.customerAccessTokenDelete.deletedAccessToken) {
        console.log('errors here?');

        throw new Error('An unexpected error occured.');
      }

      console.log(
        'Logged out! Deleted Access Token:',
        data.customerAccessTokenDelete.deletedAccessToken
      );

      setAccessToken(null);
    } finally {
      setProcessing(false);
    }
  }, [accessToken, processing]);

  const toast = useToast();
  const { promise } = useToast();
  const { push } = useRouter();

  /**
   * Trigger an app-wide logout to homescreen, and redirect to homescreen after. Also triggers toasts. Async.
   */
  const triggerLogoutToHomescreen = useCallback(async () => {
    if (!initialized) return;
    if (accessToken) {
      promise(logout(), {
        loading: {
          title: 'Logging out...'
        },
        success: {
          title: 'Successfully logged out!',
          description: 'Redirecting to home screen.'
        },
        error: (err) => {
          return {
            title: err.name,
            description: err.message + ' Redirecting to home screen.'
          };
        }
      });
    } else {
      toast({
        title: 'Not logged in currently.',
        description: 'Redirecting to home screen.',
        duration: 3000
      });
    }
    push('/');
  }, [accessToken, initialized, logout, promise, push, toast]);

  return {
    accessToken,
    auth: {
      signup,
      login,
      logout,
      helpers: { triggerLogoutToHomescreen }
    },
    processing,
    initialized
  };
}

export const ShopifyAuthContext = createContext<
  ReturnType<typeof useShopifyAuthClientGenerator>
>({
  accessToken: null,
  auth: {
    signup: processingFunction,
    login: processingFunction,
    logout: processingFunction,
    helpers: { triggerLogoutToHomescreen: processingFunction }
  },
  processing: true,
  initialized: false
});

export function useShopifyAuth() {
  return useContext(ShopifyAuthContext);
}
