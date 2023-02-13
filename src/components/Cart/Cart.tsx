import { useCart } from '@/components/Cart/context/CartContext';
import getFormattedCost from '@/lib/utils/get-formatted-cost';
import { MinusIcon } from '@chakra-ui/icons';
import {
  Box,
  Spacer,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Select,
  Text,
  Image,
  useDisclosure,
  AspectRatio,
  Stack,
  Center,
  VStack,
  Button,
  Skeleton,
  Divider,
  CloseButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Link
} from '@chakra-ui/react';
import { useRef } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import CartPopoverBody from './parts/CartPopoverBody';
import { useNewProductPopover } from './parts/CartPopoverBody/context/NewProductPopoverContext';
import NextLink from 'next/link';
import getProductHref from '@/lib/utils/get-product-href';
import { useTranslation } from 'react-i18next';
import useLocale from '@/lib/utils/hooks/useLocale';
import useCheckout from '@/lib/queries/checkout/hooks/useCheckout';

const Cart = () => {
  const { data, processing } = useCart();
  const { popoverContent, setPopoverContent } = useNewProductPopover();
  const {
    isOpen: drawerIsOpen,
    onOpen: drawerOnOpen,
    onClose: drawerOnClose
  } = useDisclosure();
  const { languageCode } = useLocale();
  const { initiateCheckout } = useCheckout();

  const { t } = useTranslation('common');

  function clearPopoverContent() {
    setPopoverContent(null);
  }

  const btnRef = useRef<HTMLButtonElement | null>(null);

  const integerOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <>
      <Popover
        isOpen={!!popoverContent}
        onClose={clearPopoverContent}
        placement='bottom-end'
        closeOnBlur
        closeOnEsc
      >
        <PopoverTrigger>
          <IconButton
            onClick={() => {
              drawerOnOpen();
              clearPopoverContent();
            }}
            ref={btnRef}
            h='full'
            aria-label='cart'
            color='black'
            variant='ghost'
            rounded='none'
            icon={<FiShoppingCart />}
          />
        </PopoverTrigger>
        <PopoverContent
        // w='md' this gives add to cart popover good styling but breakes the layout since its to wide
        >
          <PopoverArrow />
          <PopoverCloseButton onClick={clearPopoverContent} />
          <PopoverHeader>{t('cart-page.messages.added-cart')}</PopoverHeader>
          <PopoverBody>
            {popoverContent ? (
              <CartPopoverBody
                productVariant={popoverContent}
                count={data?.cart?.data?.totalQuantity}
                drawerOnOpen={() => {
                  drawerOnOpen();
                  clearPopoverContent();
                }}
              />
            ) : (
              <></>
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Drawer
        isOpen={drawerIsOpen}
        onClose={drawerOnClose}
        placement='right'
        finalFocusRef={btnRef}
        size={['sm', 'xl']}
      >
        <DrawerOverlay />
        <DrawerContent key={languageCode}>
          <DrawerHeader p={10}>
            <Flex alignItems={'center'}>
              {t('cart-page.title')}
              {data?.cart?.data?.totalQuantity
                ? ` (${data?.cart?.data.totalQuantity})`
                : ''}
              <Spacer />
              <CloseButton onClick={drawerOnClose} size='lg' />
            </Flex>
          </DrawerHeader>

          <DrawerBody p={0}>
            <Divider />

            {data?.cart?.data?.totalQuantity ? (
              <>
                <Flex flexDirection={{ base: 'column', lg: 'row' }} h='full'>
                  <Stack flex='5' overflowY={'auto'} p={4}>
                    {data.cart.data.lines.nodes.map(
                      ({ merchandise, id, quantity }) => (
                        <Box key={merchandise.id}>
                          <Flex p={4} gap={4}>
                            <AspectRatio ratio={1 / 1} flex={1}>
                              <Image
                                objectFit='contain'
                                src={merchandise.image?.url}
                                alt={
                                  merchandise.image?.altText ??
                                  merchandise.product.title
                                }
                              />
                            </AspectRatio>
                            <Flex direction={'column'} gap={1} flex={3}>
                              <Box
                                display='flex'
                                justifyContent='space-between'
                              >
                                <Link
                                  as={NextLink}
                                  href={getProductHref(
                                    merchandise.product.handle,
                                    merchandise.id
                                  )}
                                  w='full'
                                  onClick={() => {
                                    drawerOnClose();
                                  }}
                                >
                                  <Heading size='sm' as='h3' w='80%'>
                                    {merchandise.product.title}
                                  </Heading>
                                </Link>
                                <IconButton
                                  variant='outline'
                                  isRound={true}
                                  size='sm'
                                  aria-label='Delete Cart Item'
                                  icon={<MinusIcon boxSize={3} />}
                                  disabled={processing}
                                  onClick={() => data.actions.del(id)}
                                />
                              </Box>
                              <Box mb={2}>
                                <Text fontSize='sm'>
                                  {merchandise.title !== 'Default Title'
                                    ? merchandise.title
                                    : ''}
                                </Text>
                              </Box>
                              <Box display='flex' gap={10}>
                                <Select
                                  value={quantity}
                                  maxW={20}
                                  disabled={processing}
                                  onChange={async (e) => {
                                    await data.actions.edit(
                                      id,
                                      Number(e.target.value)
                                    );
                                  }}
                                >
                                  {integerOptions.map((number) => (
                                    <option
                                      key={number}
                                      value={number}
                                      disabled={
                                        Number(number) >
                                        (merchandise?.quantityAvailable ?? 0)
                                      }
                                    >
                                      {number}
                                    </option>
                                  ))}
                                </Select>
                                <Text
                                  fontSize='md'
                                  color='brand-primary.500'
                                  lineHeight={10}
                                >
                                  {getFormattedCost(
                                    merchandise.price.amount,
                                    merchandise.price.currencyCode
                                  )}
                                </Text>
                              </Box>
                            </Flex>
                          </Flex>
                          <Divider />
                        </Box>
                      )
                    )}
                  </Stack>

                  <Box flex={{ base: 'auto', lg: '3' }} p={8}>
                    <Skeleton isLoaded={!!data && !processing}>
                      <VStack gap='2'>
                        <Flex w='full' fontWeight='bold'>
                          <Text>{t('cart-page.subtotal')}</Text>
                          <Spacer></Spacer>
                          <Text>
                            {getFormattedCost(
                              data?.cart.data.cost.subtotalAmount.amount,
                              data?.cart.data.cost.subtotalAmount.currencyCode
                            )}
                          </Text>
                        </Flex>
                        <Text
                          fontWeight='light'
                          textAlign='center'
                          fontSize='sm'
                          fontStyle='italic'
                        >
                          {t('cart-page.messages.tax-shipping')}
                        </Text>
                        <Button
                          onClick={() => initiateCheckout()}
                          colorScheme='brand-primary'
                          size='lg'
                          w='full'
                        >
                          {t('cart-page.buttons.proceed-checkout')}
                        </Button>
                        <VStack>
                          <Text fontSize='md'>
                            {t('cart-page.messages.checking-out-as')}
                            {` `}
                            <b>
                              {data.cart.data.buyerIdentity.customer
                                ?.displayName
                                ? data.cart.data.buyerIdentity.customer
                                    .displayName
                                : t('cart-page.guest')}
                            </b>
                          </Text>
                          <Text fontSize='sm'>
                            <i>
                              {data.cart.data.buyerIdentity.customer?.email
                                ? `(${data.cart.data.buyerIdentity.customer.email})`
                                : ''}
                            </i>
                          </Text>
                        </VStack>
                      </VStack>
                    </Skeleton>
                  </Box>
                </Flex>
              </>
            ) : (
              <Center h='md'>
                <VStack gap={4}>
                  <Box textAlign='center'>
                    <Heading as='h4' size='sm' pb={2}>
                      {t('cart-page.messages.empty-cart')}
                    </Heading>
                  </Box>
                </VStack>
              </Center>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Cart;
