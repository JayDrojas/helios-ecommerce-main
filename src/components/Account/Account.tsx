import type { GetCustomerByAccessTokenQuery } from '@/graphql/shopify';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Container,
  Heading,
  Flex,
  SlideFade
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddressTabBody from './parts/AddressTabBody';
import InfoTabBody from './parts/InfoTabBody';
import OrdersTabBody from './parts/OrdersTabBody';
import OverviewTabBody from './parts/OverviewTabBody';
import useWindowSize from '@/lib/utils/hooks/useWindowSize';

interface Props {
  user: GetCustomerByAccessTokenQuery['customer'];
  setUser: Dispatch<SetStateAction<GetCustomerByAccessTokenQuery['customer']>>;
}

const Account = ({ user, setUser }: Props) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { t } = useTranslation('common');

  const handleTabsChange = (index: SetStateAction<number>) => {
    setTabIndex(index);
  };

  const styleSelectedTab = {
    borderColor: 'black',
    borderBottom: '2px',
    fontWeight: 'bold',
    color: 'black'
  };

  const size = useWindowSize();
  return (
    <Container maxW={'container.xl'} pt={6}>
      <Heading as='h1' fontSize='sm' color='brand-primary.500'>
        {t('account-page.title')}
      </Heading>
      <Tabs
        size={['md', 'lg']}
        variant='unstyled'
        index={tabIndex}
        onChange={handleTabsChange}
        align='start'
        w='full'
        orientation={
          size && size.width && size.width <= 520 ? 'vertical' : 'horizontal'
        }
        isLazy
      >
        <Flex flexDirection={['column']} w='full'>
          <TabList>
            <Tab color='gray' _selected={styleSelectedTab}>
              {t('account-page.tab-titles.overview')}
            </Tab>
            <Tab color='gray' _selected={styleSelectedTab}>
              {t('account-page.tab-titles.info')}
            </Tab>
            <Tab color='gray' _selected={styleSelectedTab}>
              {t('account-page.tab-titles.addresses')}
            </Tab>
            <Tab color='gray' _selected={styleSelectedTab}>
              {t('account-page.tab-titles.order')}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <SlideFade offsetY='20px' in={tabIndex === 0}>
                <OverviewTabBody
                  user={user}
                  handleTabsChange={handleTabsChange}
                />
              </SlideFade>
            </TabPanel>
            <TabPanel>
              <SlideFade offsetY='20px' in={tabIndex === 1}>
                <InfoTabBody user={user} setUser={setUser} />
              </SlideFade>
            </TabPanel>
            <TabPanel>
              <AddressTabBody />
            </TabPanel>
            <TabPanel>
              <OrdersTabBody />
            </TabPanel>
          </TabPanels>
        </Flex>
      </Tabs>
    </Container>
  );
};

export default Account;
