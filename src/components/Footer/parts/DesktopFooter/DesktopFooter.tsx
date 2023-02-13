import {
  VStack,
  GridItem,
  Grid,
  Text,
  Image,
  HStack,
  Flex,
  SimpleGrid,
  Link,
  IconButton,
  Container
} from '@chakra-ui/react';
import { IoMdBicycle } from 'react-icons/io';
import NextLink from 'next/link';
import type { FooterContentFromQuery } from '@/lib/interfaces';
import { useTranslation } from 'react-i18next';

interface Props {
  footer: FooterContentFromQuery;
}

const DesktopFooter = ({ footer }: Props) => {
  const { t } = useTranslation('common');

  return (
    <VStack bgColor='gray.50' as='footer' p={10}>
      <Container maxW={'container.xl'}>
        <Grid
          templateRows='repeat(2, 1fr)'
          templateColumns='repeat(6, 1fr)'
          gap={6}
          w='100%'
          m='auto'
          mb={10}
        >
          <GridItem colSpan={1} rowSpan={2}>
            <IconButton
              href={'/'}
              as={NextLink}
              color='brand-primary.400'
              fontSize='5xl'
              h={16}
              p={4}
              bg='none'
              aria-label='Homepage'
              variant='solid'
              icon={<IoMdBicycle />}
            />
          </GridItem>
          <GridItem colSpan={4} rowSpan={2}>
            <SimpleGrid columns={[1, 2, 4]} w='full' gap={6} p={4} minW={150}>
              {footer.footerColumnsCollection?.items.map((column, index) => (
                <VStack
                  key={`${column?.sys.id}${index}`}
                  flexDir='column'
                  alignItems='flex-start'
                  spacing={5}
                >
                  <Text fontWeight='bold'>{column?.title}</Text>
                  <VStack spacing={2} alignItems='flex-start' fontSize='md'>
                    {column?.footerColumnItemCollection?.items.map(
                      (item, indexItem) => (
                        <Link
                          as={NextLink}
                          key={`${item?.sys.id}${indexItem}`}
                          href={item?.url ? item?.url : '/home'}
                          wordBreak='normal'
                          noOfLines={[1, 2, 3]}
                          color='gray.500'
                        >
                          {item?.title}
                        </Link>
                      )
                    )}
                  </VStack>
                </VStack>
              ))}
            </SimpleGrid>
          </GridItem>
          <GridItem colSpan={1} rowSpan={2} w='fit-content'>
            <HStack gap={6} justifyContent='flex-end' minW={150}>
              {footer.socialMediaLinksCollection?.items.map((item) => (
                <NextLink key={item?.title} href={item?.url ? item?.url : ''}>
                  <Image
                    src={item?.icon?.url ? item?.icon?.url : ''}
                    width={4}
                    height={4}
                    alt={item?.url ? item?.url : ''}
                  />
                </NextLink>
              ))}
            </HStack>
          </GridItem>
        </Grid>
        <Flex
          color='gray.400'
          justifyContent='space-between'
          w='100%'
          m='auto'
          fontSize='sm'
          minW={100}
        >
          <HStack gap={10}>
            <Text>{footer.copyright}</Text>
            <Text>
              {t('footer.made-by')}{' '}
              <Link
                as={NextLink}
                href={footer.publisher?.url ? footer.publisher.url : ''}
                style={{ textDecoration: 'underline' }}
              >
                {footer.publisher?.title}
              </Link>
            </Text>
          </HStack>
          <HStack gap={4}>
            <Link as={NextLink} href={footer.termsUrl ? footer.termsUrl : ''}>
              {t('footer.terms')}
            </Link>
            <Link
              as={NextLink}
              href={footer.privacyUrl ? footer.privacyUrl : ''}
            >
              {t('footer.privacy')}
            </Link>
          </HStack>
        </Flex>
      </Container>
    </VStack>
  );
};

export default DesktopFooter;
