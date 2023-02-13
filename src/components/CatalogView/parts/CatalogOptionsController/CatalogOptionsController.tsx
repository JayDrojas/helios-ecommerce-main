import type { CollectionCatalogQuery } from '@/graphql/shopify';
import {
  Box,
  CheckboxGroup,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  StyleProps
} from '@chakra-ui/react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react';
import type { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import type { priceRangeFilterOptions } from '../../CatalogView';
import CatalogOptionsControllerField from './parts/CatalogOptionsControllerField';

interface Props extends StyleProps {
  filters: string[];
  setFilters: Dispatch<SetStateAction<string[]>>;
  priceFilterIndex: number;
  setPriceFilterIndex: Dispatch<SetStateAction<number>>;
  priceRangeFilterOptions: typeof priceRangeFilterOptions;
  availableFilters:
    | NonNullable<CollectionCatalogQuery['collection']>['products']['filters'];
}

const CatalogOptionsController = ({
  filters,
  setFilters,
  priceFilterIndex,
  setPriceFilterIndex,
  priceRangeFilterOptions,
  availableFilters,
  ...rest
}: Props) => {
  const { t } = useTranslation('common');
  return (
    <Box {...rest}>
      <Accordion
        allowMultiple
        defaultIndex={[
          0,
          ...filters.map((v, index) => {
            const x = availableFilters?.findIndex((val) => {
              return val.values.find((input) => input.input === v);
            });
            /**
             * value of index 0 needs to be casted to 1, otherwise, it is mistaken for the
             * index of the price selector for some reason...
             */
            return x === 0 ? 1 : x;
          })
        ]}
      >
        <AccordionItem>
          <AccordionButton>
            <Heading size='sm' flex='1' textAlign='left'>
              {t('catalog-page.options-controller.min-price-title')}
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <RadioGroup
              value={priceFilterIndex.toString()}
              onChange={(value) => setPriceFilterIndex(Number(value))}
            >
              <Stack>
                {priceRangeFilterOptions.map((option, index) => (
                  <Radio key={option.label} value={index.toString()}>
                    {option.label}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </AccordionPanel>
        </AccordionItem>
        <CheckboxGroup
          defaultValue={filters}
          onChange={(v) => {
            console.log(v);
            setFilters(v as string[]);
          }}
        >
          {availableFilters
            .filter((e) => e.type === 'LIST')
            .map((filter) => {
              return (
                <CatalogOptionsControllerField
                  key={filter.label}
                  filter={filter}
                  selectedFilters={filters}
                />
              );
            })}
        </CheckboxGroup>
      </Accordion>
    </Box>
  );
};

export default CatalogOptionsController;
