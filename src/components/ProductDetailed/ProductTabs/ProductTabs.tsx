import type { ProductDetailedQuery } from '@/graphql/shopify';
import {
  Box,
  Tab,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Tr,
  Td,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Heading,
  Thead,
  Th,
  Center
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface Props {
  description: string | undefined;
  variantData:
    | NonNullable<
        NonNullable<ProductDetailedQuery['product']>['variants']['nodes'][0]
      >
    | undefined
    | null;
  shippingData: any;
}

function transformMetaFields(arr: any): any {
  if (!arr) return [];
  const dimensions = [];
  let specifications = {};
  for (const metaField of arr) {
    if (metaField) {
      const copyMetaField = { ...metaField };
      const temp = JSON.parse(copyMetaField.value);

      if (Array.isArray(temp)) {
        const objAssign: { [key: string]: number | string } = {};
        for (const i of temp) {
          const split: string[] = i.split(':');
          const key = split[0];
          objAssign[key] = split[1];
        }
        copyMetaField.value = objAssign;
        specifications = { ...copyMetaField };
      } else if (typeof temp === 'object') {
        copyMetaField.value = temp;
        dimensions.push(copyMetaField);
      }
    }
  }

  const returnedObj = {
    dimensions,
    specifications
  };
  return returnedObj;
}

const ProductTabs = ({ description, variantData, shippingData }: Props) => {
  const metaFields = transformMetaFields(variantData?.metafields);
  const { t } = useTranslation('common');

  return (
    <Box>
      <Tabs isFitted overflowX='auto' size={['sm', 'md']}>
        <TabList>
          <Tab>{t('product-page.tabs.desc')}</Tab>
          <Tab
            isDisabled={
              metaFields?.dimensions?.length === 0 &&
              Object.keys(metaFields?.specifications).length === 0
                ? true
                : false
            }
          >
            {t('product-page.tabs.spec')}
          </Tab>
          <Tab>{t('product-page.tabs.shipping')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Center>
              <Box w='full' py={8}>
                <Text>{description}</Text>
              </Box>
            </Center>
          </TabPanel>
          <TabPanel>
            <Center>
              <Box w='full' py={8} maxW='container.md'>
                {metaFields?.dimensions?.length ? (
                  <Box>
                    <Heading as='h2' size='lg'>
                      {t('product-page.specification-tab.dimensions.title')}
                    </Heading>
                    <TableContainer py={4}>
                      <Table variant='striped' size='md'>
                        <TableCaption>
                          {t(
                            'product-page.specification-tab.dimensions.caption'
                          )}
                        </TableCaption>
                        <Thead>
                          <Tr>
                            <Th>
                              {t(
                                'product-page.specification-tab.dimensions.measurement'
                              )}
                            </Th>
                            <Th>
                              {t(
                                'product-page.specification-tab.dimensions.value'
                              )}
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {metaFields?.dimensions.map((dimen: any) => (
                            <Tr key={dimen.key}>
                              <Td fontWeight={'semibold'}>{dimen.key}</Td>
                              <Td>{dimen.value.value}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Box>
                ) : (
                  <>
                    <Text>
                      {t(
                        'product-page.specification-tab.specification.specs-unavailable'
                      )}
                    </Text>
                  </>
                )}
                {metaFields?.specifications &&
                Object.keys(metaFields?.specifications).length > 0 ? (
                  <Box>
                    <Heading as='h2' size='lg'>
                      {t('product-page.specification-tab.specification.title')}
                    </Heading>
                    <TableContainer py={4}>
                      <Table variant='striped' size='md'>
                        <TableCaption>
                          {t(
                            'product-page.specification-tab.specification.caption'
                          )}{' '}
                        </TableCaption>
                        <Thead>
                          <Tr>
                            <Th>
                              {t(
                                'product-page.specification-tab.specification.specification'
                              )}
                            </Th>
                            <Th>
                              {t(
                                'product-page.specification-tab.specification.value'
                              )}
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {Object.keys(metaFields.specifications.value).map(
                            (key: any) => (
                              <Tr key={key}>
                                <Td fontWeight={'semibold'}>{key}</Td>
                                <Td>{metaFields.specifications.value[key]}</Td>
                              </Tr>
                            )
                          )}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Box>
                ) : (
                  <></>
                )}
              </Box>
            </Center>
          </TabPanel>
          <TabPanel>
            <Center>
              <Box w='full' py={8}>
                <Text>
                  {shippingData?.value
                    ? shippingData?.value
                    : t('product-page.shipping-tab.shipping-unavailable')}
                </Text>
              </Box>
            </Center>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ProductTabs;
