import type {Preview} from '@storybook/web-components';
import { initialize, mswDecorator } from 'msw-storybook-addon';

import "./styles.css";
/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize();

const preview: Preview = {
  decorators: [mswDecorator],
  parameters: {
    actions: {argTypesRegex: '^on[A-Z].*'},
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        order: ["Introduction","Components"]
      }
    }
  },
};

export default preview;
