import { MdModeEdit } from 'react-icons/md';
import {
  Flex,
  Stack,
  Box,
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormErrorMessage,
  IconButton,
  Card,
  CardBody,
  Button
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { GetCustomerByAccessTokenQuery } from '@/graphql/shopify';
import { IoMdClose } from 'react-icons/io';
import { useTranslation } from 'react-i18next';

interface Props {
  user: GetCustomerByAccessTokenQuery['customer'];
  updateCustomerForm: UseFormReturn<
    {
      firstName: string;
      lastName: string;
      email: string;
      password: string | null;
      phone: string | null;
      acceptsMarketing: boolean;
    },
    any
  >;
}

const UpdateNameForm = ({ user, updateCustomerForm }: Props) => {
  const [editable, setEditable] = useState(false);
  const {
    register,
    formState: { errors },
    reset
  } = updateCustomerForm;
  const { t } = useTranslation('common');

  function toggleEdit() {
    setEditable(!editable);
    reset();
  }

  useEffect(() => {
    setEditable(false);
  }, [user]);

  return (
    <Card
      w='full'
      borderRadius='md'
      borderColor='grey.200'
      borderWidth='1px'
      p={[2, 8]}
    >
      <CardBody>
        <Flex justifyContent='space-between' mb={4}>
          <Stack w='md' gap={4}>
            <Box>
              <VStack gap={4}>
                <FormControl isInvalid={!!errors.firstName}>
                  <FormLabel color='brand-primary.500'>
                    {t('auth-forms.labels.first-name')}
                  </FormLabel>
                  <Input
                    {...register('firstName')}
                    readOnly={!editable}
                    variant={editable ? 'outline' : 'unstyled'}
                    fontWeight='bold'
                    bgColor={editable ? 'gray.100' : 'none'}
                  />
                  <FormErrorMessage>
                    {errors.firstName && errors.firstName.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.lastName}>
                  <FormLabel color='brand-primary.500'>
                    {t('auth-forms.labels.last-name')}
                  </FormLabel>
                  <Input
                    {...register('lastName')}
                    readOnly={!editable}
                    variant={editable ? 'outline' : 'unstyled'}
                    fontWeight='bold'
                    bgColor={editable ? 'gray.100' : 'none'}
                  />
                  <FormErrorMessage>
                    {errors.lastName && errors.lastName.message}
                  </FormErrorMessage>
                </FormControl>
              </VStack>
            </Box>
          </Stack>
          {editable ? (
            <IconButton
              onClick={toggleEdit}
              aria-label='exit edit'
              bg='none'
              size='lg'
              color='gray'
              sx={{
                '@media (max-width: 600px)': {
                  display: 'none'
                }
              }}
              icon={<IoMdClose />}
            />
          ) : (
            <IconButton
              onClick={toggleEdit}
              aria-label='edit'
              bg='none'
              size='lg'
              color='gray'
              icon={<MdModeEdit />}
            />
          )}
        </Flex>
        {editable ? (
          <Button
            onClick={toggleEdit}
            aria-label='exit edit'
            bg='gray.300'
            size='sm'
            color='gray'
            display='none'
            sx={{
              '@media (max-width: 600px)': {
                display: 'block'
              }
            }}
          >
            Cancel
          </Button>
        ) : (
          <></>
        )}
      </CardBody>
    </Card>
  );
};

export default UpdateNameForm;
