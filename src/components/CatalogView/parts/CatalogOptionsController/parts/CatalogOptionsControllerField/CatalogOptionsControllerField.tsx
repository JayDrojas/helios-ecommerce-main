import type { CollectionCatalogQuery } from '@/graphql/shopify';
import {
  AccordionItem,
  AccordionButton,
  Heading,
  AccordionIcon,
  AccordionPanel,
  Stack,
  Checkbox
} from '@chakra-ui/react';

interface Props {
  filter: NonNullable<
    NonNullable<CollectionCatalogQuery['collection']>['products']['filters']
  >[0];
  selectedFilters: string[];
}

const CatalogOptionsControllerFields = ({ filter, selectedFilters }: Props) => {
  return (
    <>
      <AccordionItem key={filter.label}>
        <AccordionButton>
          <Heading size='sm' flex='1' textAlign='left'>
            {filter.label}
          </Heading>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Stack>
            {filter.values?.map((choice) => (
              <Checkbox
                key={choice.input}
                value={choice.input}
                isChecked={true}
              >
                {choice.label}
              </Checkbox>
            ))}
          </Stack>
        </AccordionPanel>
      </AccordionItem>
    </>
  );
};

export default CatalogOptionsControllerFields;
