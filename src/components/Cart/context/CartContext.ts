import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import apollo from '@/lib/clients/apollo';
import getLocalCartId from '@/components/Cart/context/utils/getLocalCartId';
import {
  AddCartLineDocument,
  AttachUserToCartDocument,
  CartContentsFragment,
  DeleteCartLineDocument,
  DetachUserFromCartDocument,
  LanguageCode,
  UpdateCartLineDocument,
  ViewCartDocument
} from '@/graphql/shopify';
import useLocale from '@/lib/utils/hooks/useLocale';

const key = 'shopify-cart-id';
export function useLocalCartId() {
  const [value, setValue] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    async function fetchData() {
      const data = await getLocalCartId(key);
      setValue(data);
      setLoading(false);
    }
    fetchData();
  }, []);
  return {
    data: value,
    loading
  };
}

const initialContext = {
  data: {
    cart: undefined,
    cartId: undefined,
    actions: {
      add: async () => {
        return;
      },
      edit: async () => {
        return;
      },
      refresh: async () => {
        return;
      },
      del: async () => {
        return;
      },
      attachUser: async () => {
        return;
      },
      detachUser: async () => {
        return;
      },
      wipe: async () => {
        return;
      }
    }
  },
  initializing: true,
  processing: true
};

interface CartData {
  data: CartContentsFragment | undefined;
  loading: boolean;
}

interface CartActions {
  add: (merchandiseId: string) => Promise<void>;
  edit: (lineId: string, quantity: number) => Promise<void>;
  del: (lineId: string) => Promise<void>;
  refresh: (languageCode: LanguageCode) => Promise<void>;
  attachUser: (accessToken: string) => Promise<void>;
  detachUser: () => Promise<void>;
  wipe: () => Promise<void>;
}

export function useCartState(cartId: string | undefined): {
  data: {
    cart: CartData | undefined;
    actions: CartActions;
    cartId: string | undefined;
  };
  initializing: boolean;
  processing: boolean;
} {
  const { languageCode } = useLocale();

  const [cart, setCart] = useState<CartData>({
    data: undefined,
    loading: true
  });
  const [processing, setProcessing] = useState<boolean>(false);

  const detachUser = useCallback(async () => {
    if (!cart.data || cart.loading || !cartId || processing) return;
    setProcessing(true);
    try {
      console.log('detaching');

      const { data, errors } = await apollo.mutate({
        mutation: DetachUserFromCartDocument,
        variables: {
          cartId
        }
      });

      if ((errors && errors.length > 0) || !data?.cartBuyerIdentityUpdate) {
        throw new Error('An expected error occured');
      }
      if (data.cartBuyerIdentityUpdate.userErrors.length > 0) {
        console.error(data.cartBuyerIdentityUpdate.userErrors);
        throw new Error('A user error occured');
      }
      if (!data.cartBuyerIdentityUpdate.cart) {
        throw new Error('An unexpected error occured');
      }

      setCart({
        data: data.cartBuyerIdentityUpdate.cart,
        loading: false
      });
    } finally {
      setProcessing(false);
    }
  }, [cart.data, cart.loading, cartId, processing]);

  const attachUser = useCallback(
    async (accessToken: string) => {
      try {
        if (!cart.data || cart.loading || !cartId || processing) return;
        setProcessing(true);

        console.log('attaching');

        const { data, errors } = await apollo.mutate({
          mutation: AttachUserToCartDocument,
          variables: {
            accessToken,
            cartId
          }
        });

        if ((errors && errors.length > 0) || !data?.cartBuyerIdentityUpdate) {
          throw new Error('An expected error occured');
        }
        if (data.cartBuyerIdentityUpdate.userErrors.length > 0) {
          console.error(data.cartBuyerIdentityUpdate.userErrors);
          throw new Error('A user error occured');
        }
        if (!data.cartBuyerIdentityUpdate.cart) {
          throw new Error('An unexpected error occured');
        }

        setCart({
          data: data.cartBuyerIdentityUpdate.cart,
          loading: false
        });
      } finally {
        setProcessing(false);
      }
    },
    [cart.data, cart.loading, cartId, processing]
  );

  /** Utils */

  const refresh = useCallback(
    async (languageCode: LanguageCode) => {
      if (!cartId || processing) return;
      setProcessing(true);
      try {
        const { data, error } = await apollo.query({
          query: ViewCartDocument,
          variables: {
            cartId,
            language: languageCode
          },
          fetchPolicy: 'no-cache'
        });
        if (!data.cart?.lines.nodes || error) {
          throw new Error('Unable to find products.');
        }
        setCart({ data: data.cart, loading: false });
      } finally {
        setProcessing(false);
      }
    },
    [cartId, processing]
  );

  const add = useCallback(
    async (merchandiseId: string) => {
      if (!cart.data || cart.loading || !cartId || processing) return;

      if (cart.data.lines.nodes.length >= 100) {
        throw new Error('Maximum cart count is 100.');
      }
      try {
        setProcessing(true);

        const { data, errors } = await apollo.mutate({
          mutation: AddCartLineDocument,
          variables: {
            cartId,
            merchandiseId
          }
        });
        if (errors) {
          console.error(errors);
          throw new Error(
            'An unexpected error occured when adding product to cart.'
          );
        }
        if (!data?.cartLinesAdd?.cart?.lines.nodes) {
          throw new Error('Unable to add product to cart.');
        }
        setCart({
          data: data.cartLinesAdd.cart,
          loading: false
        });
      } finally {
        setProcessing(false);
        refresh(languageCode);
      }
    },
    [cartId, cart.data, cart.loading, processing, refresh]
  );

  const edit = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart.data || cart.loading || !cartId || processing) return;

      setProcessing(true);

      try {
        const { data, errors } = await apollo.mutate({
          mutation: UpdateCartLineDocument,
          variables: {
            cartId,
            lineId,
            quantity
          }
        });

        if (errors) {
          console.error(errors);
        }

        if (!data?.cartLinesUpdate?.cart?.lines.nodes) {
          throw new Error('Unable to add product to cart.');
        }
        setCart({
          data: data.cartLinesUpdate.cart,
          loading: false
        });
      } finally {
        setProcessing(false);
        refresh(languageCode);
      }
    },
    [cartId, cart.data, cart.loading, processing, refresh]
  );

  const del = useCallback(
    async (lineId: string) => {
      if (!cart.data || cart.loading || !cartId || processing) return;

      setProcessing(true);
      try {
        const { data, errors } = await apollo.mutate({
          mutation: DeleteCartLineDocument,
          variables: {
            cartId,
            lineId
          }
        });

        if (errors) {
          console.error(errors);
        }

        if (!data?.cartLinesRemove?.cart?.lines.nodes) {
          throw new Error('Unable to add product to cart.');
        }

        setCart({
          data: data.cartLinesRemove.cart,
          loading: false
        });
      } finally {
        setProcessing(false);
        refresh(languageCode);
      }
    },
    [cartId, cart.data, cart.loading, processing, refresh]
  );

  const wipe = useCallback(async () => {
    if (!cartId || processing) return;
    setProcessing(true);
    try {
      localStorage.removeItem(key);
    } finally {
      setProcessing(false);
      refresh(languageCode);
    }
  }, [cartId, languageCode, processing, refresh]);

  /** ---- */

  useEffect(() => {
    if (processing) return;
    refresh(languageCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartId]);

  useEffect(() => {
    refresh(languageCode);
  }, [languageCode]);

  if (!cartId) return initialContext;

  return {
    data: {
      cart: cart,
      actions: {
        add,
        edit,
        refresh,
        del,
        attachUser,
        detachUser,
        wipe
      },
      cartId
    },
    initializing: false,
    processing
  };
}

export const CartContext =
  createContext<ReturnType<typeof useCartState>>(initialContext);

export function useCart() {
  return useContext(CartContext);
}
