import { create } from '@storybook/theming';
import imageFile from './assets/logo.png';

export default create({
  base: 'light',
  brandTitle: 'PnP Modern Search - Core components',
  brandImage: imageFile,
  colorSecondary: '#0078d4',
  brandTarget: '_self',
  fontBase: "Segoe UI"
});