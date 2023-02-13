import type { GetCustomerByAccessTokenQuery } from '@/graphql/shopify';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Center
} from '@chakra-ui/react';
import type { SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  user: GetCustomerByAccessTokenQuery['customer'];
  handleTabsChange: (index: SetStateAction<number>) => void;
}

const OverviewTabBody = ({ user, handleTabsChange }: Props) => {
  const { t } = useTranslation('common');
  return (
    <>
      <Center>
        <SimpleGrid pt={16} spacing={8} w='full' columns={[1, 1, 2]}>
          <Card bgColor='gray.50' borderRadius='md' p={2}>
            <CardHeader pb={2}>
              <Flex justifyContent='space-between'>
                <Heading size='sm'>{t('account-page.tab-titles.info')}</Heading>
                <ArrowForwardIcon onClick={() => handleTabsChange(1)} />
              </Flex>
            </CardHeader>
            <CardBody>
              <Stack gap={4}>
                <Box>
                  <Heading size='xs' color='brand-primary.400' py={2}>
                    {t('account-page.overview-tab.first-name')}
                  </Heading>
                  <Text
                    css={{
                      '&:first-letter': {
                        textTransform: 'uppercase'
                      }
                    }}
                  >
                    {user?.firstName}
                  </Text>
                </Box>
                <Box>
                  <Heading size='xs' color='brand-primary.400' py={2}>
                    {t('account-page.overview-tab.last-name')}
                  </Heading>
                  <Text
                    css={{
                      '&:first-letter': {
                        textTransform: 'uppercase'
                      }
                    }}
                  >
                    {user?.lastName}
                  </Text>
                </Box>
                <Box>
                  <Heading size='xs' color='brand-primary.400' py={2}>
                    {t('account-page.overview-tab.email')}
                  </Heading>
                  <Text>{user?.email}</Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
          <Card bgColor='gray.50' borderRadius='md' p={2}>
            <CardHeader pb={2}>
              <Flex justifyContent='space-between'>
                <Heading size='sm'>
                  {t('account-page.overview-tab.default-address')}
                </Heading>
                <ArrowForwardIcon onClick={() => handleTabsChange(2)} />
              </Flex>
            </CardHeader>
            <CardBody>
              <Stack>
                <Box>
                  {user?.defaultAddress ? (
                    user.defaultAddress.formatted.map((part, index) => (
                      <Text key={index}>{part}</Text>
                    ))
                  ) : (
                    <Text>{t('address-forms.messages.no-default')}</Text>
                  )}
                </Box>
                <Box>
                  {user?.defaultAddress ? (
                    <Text>
                      {t('account-page.overview-tab.phone')}:{' '}
                      {user?.defaultAddress?.phone}
                    </Text>
                  ) : (
                    ''
                  )}
                </Box>
              </Stack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Center>
    </>
  );
};

export default OverviewTabBody;
