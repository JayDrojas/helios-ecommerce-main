import type { GetCustomerByAccessTokenQuery } from '@/graphql/shopify';
import {
  Flex,
  Stack,
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  IconButton,
  Card,
  CardBody
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
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

const UpdatePasswordForm = ({ user, updateCustomerForm }: Props) => {
  const [editable, setEditable] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = updateCustomerForm;

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
                <FormControl isInvalid={!!errors.password}>
                  <FormLabel color='brand-primary.500'>Password</FormLabel>
                  <Input
                    placeholder='*********'
                    type='password'
                    readOnly={!editable}
                    variant={editable ? 'outline' : 'unstyled'}
                    fontWeight='bold'
                  />
                  <FormErrorMessage>
                    {errors.password && errors.password.message}
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

export default UpdatePasswordForm;
