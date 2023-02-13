import type { GetCustomerWithOrdersQueryVariables } from '@/graphql/shopify';
import { Reducer, useReducer } from 'react';

type Action =
  | {
      payload: {
        cursor: string;
      };
      type: 'nextPage' | 'prevPage';
    }
  | { type: 'reset' };

export default function useOrdersQueryVariables(
  initialState: NonNullable<GetCustomerWithOrdersQueryVariables>,
  pageCount: number
) {
  if (!initialState)
    throw new Error('useOrdersQueryVariables requires initialState');

  const reducer: Reducer<typeof initialState, Action> = (prevState, action) => {
    switch (action.type) {
      case 'nextPage':
        return {
          ...prevState,
          after: action.payload.cursor,
          first: pageCount,
          before: null,
          last: null
        };
      case 'prevPage':
        return {
          ...prevState,
          after: null,
          first: null,
          before: action.payload.cursor,
          last: pageCount
        };
      case 'reset':
        return { ...initialState };
      default:
        return { ...initialState };
    }
  };

  return useReducer(reducer, null, () => ({
    ...initialState,
    first: pageCount
  }));
}
