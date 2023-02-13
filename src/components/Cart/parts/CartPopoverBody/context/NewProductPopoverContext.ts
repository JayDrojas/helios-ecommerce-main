import type { ProductDetailedQuery } from '@/graphql/shopify';
import { createContext, useContext, useState } from 'react';

type VariantBySelectedOptions = NonNullable<
  NonNullable<ProductDetailedQuery['product']>['variants']['nodes'][0]
> | null;

export function useNewProductPopoverState() {
  const [value, setValue] = useState<VariantBySelectedOptions>(null);
  return {
    popoverContent: value,
    setPopoverContent: setValue
  };
}

export const NewProductPopoverContext = createContext<
  ReturnType<typeof useNewProductPopoverState>
>({
  popoverContent: null,
  setPopoverContent: () => {}
});

export function useNewProductPopover() {
  return useContext(NewProductPopoverContext);
}
