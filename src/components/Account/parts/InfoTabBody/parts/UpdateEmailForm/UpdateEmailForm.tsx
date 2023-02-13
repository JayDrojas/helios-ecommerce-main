import type { GetCustomerByAccessTokenQuery } from '@/graphql/shopify';
import {
  Box,
  Flex,
  Stack,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Card,
  CardBody,
  IconButton
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IoMdClose } from 'react-icons/io';
import { MdModeEdit } from 'react-icons/md';

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

const UpdateEmailForm = ({ user, updateCustomerForm }: Props) => {
  const [editable, setEditable] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = updateCustomerForm;
  const { t } = useTranslation('common');

  function toggleEdit() {
    setEditable(!editable);
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
        <Flex justifyContent='space-between'>
          <Stack w='md' gap={4}>
            <Box>
              <VStack gap={4}>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel color='brand-primary.500'>
                    {t('auth-forms.labels.email')}
                  </FormLabel>
                  <Input
                    {...register('email')}
                    readOnly={!editable}
                    variant={editable ? 'outline' : 'unstyled'}
                    fontWeight='bold'
                  />
                  <FormErrorMessage>
                    {errors.email && errors.email.message}
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
              icon={<IoMdClose />}
            />
          ) : (
            <IconButton
              onClick={toggleEdit}
              aria-label='edit'
              bg='none'
              size='lg'
              color='gray'
              disabled
              icon={<MdModeEdit />}
            />
          )}
        </Flex>
      </CardBody>
    </Card>
  );
};
export default UpdateEmailForm;
