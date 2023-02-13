import type {
  CollectionCatalogQueryVariables,
  PriceRangeFilter,
  ProductCollectionSortKeys
} from '@/graphql/shopify';
import useLocale from '@/lib/utils/hooks/useLocale';
import { Reducer, useReducer } from 'react';

type Action =
  | {
      payload: {
        cursor: string;
      };
      type: 'nextPage' | 'prevPage';
    }
  | {
      type: 'changeFilter';
      payload: { filters: string[]; priceRange: PriceRangeFilter };
    }
  | {
      type: 'changeSortKey';
      payload: { sortkey: ProductCollectionSortKeys };
    }
  | { type: 'reset' }
  | { type: 'override'; payload: NonNullable<CollectionCatalogQueryVariables> };

export default function useCollectionCatalogQueryVariables(
  initialState: NonNullable<CollectionCatalogQueryVariables>,
  pageCount: number
) {
  if (!initialState) {
    throw new Error('useCollectionCatalogQueryVariables requires initialState');
  }
  const { languageCode } = useLocale();

  const allPaginationNull = {
    first: null,
    last: null,
    before: null,
    after: null
  };

  const reducer: Reducer<typeof initialState, Action> = (prevState, action) => {
    switch (action.type) {
      case 'nextPage':
        return {
          ...prevState,
          after: action.payload.cursor,
          first: pageCount,
          before: null,
          last: null,
          language: languageCode
        };
      case 'prevPage':
        return {
          ...prevState,
          after: null,
          first: null,
          before: action.payload.cursor,
          last: pageCount,
          language: languageCode
        };
      case 'changeFilter':
        return {
          ...prevState,
          ...allPaginationNull,
          first: pageCount,
          filters: [
            ...action.payload.filters.map((string: string) =>
              JSON.parse(string)
            ),
            { price: action.payload.priceRange }
          ],
          language: languageCode
        };
      case 'changeSortKey':
        return {
          ...prevState,
          ...allPaginationNull,
          first: pageCount,
          sortKey: action.payload.sortkey,
          language: languageCode
        };
      case 'override':
        return {
          ...action.payload
        };
      case 'reset':
        return { ...initialState, language: languageCode };
      default:
        return { ...initialState, language: languageCode };
    }
  };

  return useReducer(reducer, null, () => ({
    ...initialState,
    first: pageCount
  }));
}
