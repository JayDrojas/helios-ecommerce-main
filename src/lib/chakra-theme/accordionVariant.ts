import { accordionAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(accordionAnatomy.keys);

const custom = definePartsStyle({
  container: {
    border: '1px solid #E2E8F0',
    borderRadius: '4px',
    mb: '20px'
  }
});

export const accordionTheme = defineMultiStyleConfig({
  variants: { custom }
});
