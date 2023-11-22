import type {StorybookConfig} from '@storybook/web-components-webpack5';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links', 
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    }
  ],
  framework: {
    name: '@storybook/web-components-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../src/stories/assets','../public'],
  webpackFinal:  (config, options) => { 
    options.cache.set = (key: string, value: any, ttl?: number) => { return Promise.resolve({path: ""}) };
    config?.module?.rules?.push(
      {
        test: /\.ts?$/,
        use: [                           
          {
            loader: "postcss-loader"
          }          
        ],
        exclude: [
          /node_modules/,
          /tailwind-styles-css\.ts/
        ]
      }
    ); 

    return config;
  }
};
export default config;
