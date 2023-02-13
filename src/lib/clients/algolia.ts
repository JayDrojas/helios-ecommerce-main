import algoliasearch from 'algoliasearch/lite';
import { useConnector } from 'react-instantsearch-hooks-web';
import connectAutocomplete from 'instantsearch.js/es/connectors/autocomplete/connectAutocomplete';

if (
  typeof process.env.NEXT_PUBLIC_ALGOLIA_ID !== 'string' ||
  typeof process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY !== 'string'
) {
  throw new Error(
    'NEXT_PUBLIC_ALGOLIA_ID and/or NEXT_PUBLIC_ALGOLIA_SEARCH_KEY is not defined.'
  );
}

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
);

/**
 * https://www.algolia.com/doc/api-reference/widgets/autocomplete/react-hooks/
 */
export function useAutocomplete(props: any) {
  return useConnector(connectAutocomplete, props);
}

export default algoliaClient;
