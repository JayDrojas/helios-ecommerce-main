import { extendTheme } from '@chakra-ui/react';
import { accordionTheme } from './accordionVariant';
const theme = extendTheme({
  components: { Accordion: accordionTheme },
  colors: {
    'brand-primary': {
      50: '#e2edff',
      100: '#b4caff',
      200: '#86a7fa',
      300: '#5783f5',
      400: '#2860f0',
      500: '#0f47d7',
      600: '#0737a8',
      700: '#022779',
      800: '#00184c',
      900: '#00081f'
    }
  }
});

export default theme;
