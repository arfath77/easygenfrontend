import { createTheme } from '@mantine/core';

export const theme = createTheme({
  /* Put your mantine theme override here */
  components: {
    Container: {
      defaultProps: { size: 1280, px: { base: 0, md: 'xl' } },
    },
  },
});
