// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  organizationName: "Microsoft",
  projectName: "pnp-modern-search-core-components",
  deploymentBranch: "gh-pages",
  trailingSlash: false,
  title: 'PnP Modern Search Core Components',
  tagline: 'One search to rule them all.',
  favicon: 'img/favicon.png',
   staticDirectories: ['static'],
  // Set the production url of your site here
  url: 'https://microsoft-search.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/pnp-modern-search-core-components/',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/microsoft-search/pnp-modern-search-core-components/tree/main',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/microsoft-search/pnp-modern-search-core-components/tree/main',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/pnp.png',
      navbar: {
        title: 'PnP - Modern Search Core components ',
        logo: {
          alt: 'Ubisoft Logo',
          src: 'img/pnp.png'
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'mainSidebar',
            position: 'left',
            label: 'Getting started',
          },
          {
            position: 'right',
            href: 'https://azpnpmodernsearchcoresto.z9.web.core.windows.net/latest/index.html?path=/docs/introduction-getting-started--docs',
            html: `
                <a style="display:flex" href="https://azpnpmodernsearchcoresto.z9.web.core.windows.net/latest/index.html?path=/docs/introduction-getting-started--docs" target="_blank" rel="noreferrer noopener" aria-label="Components playground">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20" width="100%" height="22" fill="none" role="presentation" class="css-1r6i2mo e1skfx025"><path fill-rule="evenodd" clip-rule="evenodd" d="M26.64 15.831a8.784 8.784 0 0 1-2.464-.344c-.79-.229-1.445-.546-1.968-.952l.8-1.776c1.088.758 2.31 1.136 3.664 1.136.704 0 1.245-.114 1.624-.344.379-.229.568-.546.568-.952 0-.362-.173-.645-.52-.848-.347-.202-.963-.4-1.848-.592-.992-.202-1.784-.448-2.376-.736-.592-.288-1.024-.642-1.296-1.064-.272-.42-.408-.94-.408-1.56 0-.682.19-1.29.568-1.824.379-.533.91-.952 1.592-1.256.683-.304 1.472-.456 2.368-.456.8 0 1.57.118 2.312.352.741.235 1.33.55 1.768.944l-.8 1.776C29.189 6.578 28.101 6.2 26.96 6.2c-.65 0-1.163.126-1.536.376-.373.251-.56.595-.56 1.032 0 .256.072.467.216.632.144.166.384.312.72.44.336.128.813.262 1.432.4 1.45.32 2.493.731 3.128 1.232.635.502.952 1.195.952 2.08 0 1.067-.41 1.907-1.232 2.52-.821.614-1.968.92-3.44.92Zm10.464-1.792c.245 0 .502-.016.768-.048l-.128 1.76a6.78 6.78 0 0 1-.928.064c-1.195 0-2.067-.261-2.616-.784-.55-.522-.824-1.317-.824-2.384V9.64h-1.488V7.831h1.488V5.527h2.416v2.304h1.968V9.64h-1.968v2.992c0 .939.438 1.408 1.312 1.408Zm5.616 1.776c-.832 0-1.563-.168-2.192-.504a3.534 3.534 0 0 1-1.456-1.424c-.341-.613-.512-1.336-.512-2.168 0-.832.17-1.554.512-2.168a3.484 3.484 0 0 1 1.456-1.416c.63-.33 1.36-.496 2.192-.496.832 0 1.563.166 2.192.496.63.331 1.115.803 1.456 1.416.341.614.512 1.336.512 2.168 0 .832-.17 1.555-.512 2.168a3.534 3.534 0 0 1-1.456 1.424c-.63.336-1.36.504-2.192.504Zm0-1.84c1.173 0 1.76-.752 1.76-2.256 0-.757-.152-1.322-.456-1.696-.304-.373-.739-.56-1.304-.56-1.173 0-1.76.752-1.76 2.256 0 1.504.587 2.256 1.76 2.256Zm10.848-4.351-1.36.144c-.672.064-1.146.253-1.424.567-.277.315-.416.734-.416 1.256v4.097h-2.416V7.832h2.32V9.16c.395-.907 1.21-1.403 2.448-1.488l.704-.048.144 2Zm7.02-1.777h2.368l-4.736 10.72h-2.448l1.504-3.312-3.232-7.408h2.512l1.984 4.992 2.048-4.992Zm7.968-.208c.683 0 1.285.166 1.808.496.523.331.93.803 1.224 1.416.293.614.44 1.326.44 2.136 0 .811-.147 1.529-.44 2.152-.293.624-.704 1.11-1.232 1.457a3.207 3.207 0 0 1-1.8.52 3.121 3.121 0 0 1-1.472-.345 2.45 2.45 0 0 1-1.008-.951v1.168h-2.384V4.408h2.416v4.48a2.388 2.388 0 0 1 1-.92 3.16 3.16 0 0 1 1.448-.329Zm-.704 6.337c.566 0 1.003-.2 1.312-.6.31-.4.464-.963.464-1.688 0-.715-.154-1.262-.464-1.64-.31-.38-.746-.569-1.312-.569-.565 0-1.002.195-1.312.585-.31.389-.464.94-.464 1.655 0 .726.155 1.283.464 1.673.31.389.747.584 1.312.584Zm9.424 1.84c-.832 0-1.563-.169-2.192-.505a3.535 3.535 0 0 1-1.456-1.424c-.341-.613-.512-1.336-.512-2.168 0-.832.17-1.554.512-2.168a3.484 3.484 0 0 1 1.456-1.416c.63-.33 1.36-.496 2.192-.496.832 0 1.563.166 2.192.496.63.331 1.115.803 1.456 1.416.341.614.512 1.336.512 2.168 0 .832-.17 1.555-.512 2.168a3.535 3.535 0 0 1-1.456 1.424c-.63.336-1.36.504-2.192.504Zm0-1.84c1.174 0 1.76-.753 1.76-2.257 0-.757-.152-1.322-.456-1.696-.304-.373-.739-.56-1.304-.56-1.173 0-1.76.752-1.76 2.256 0 1.504.587 2.256 1.76 2.256Zm9.008 1.84c-.832 0-1.563-.169-2.192-.505a3.534 3.534 0 0 1-1.456-1.424c-.341-.613-.512-1.336-.512-2.168 0-.832.17-1.554.512-2.168a3.484 3.484 0 0 1 1.456-1.416c.63-.33 1.36-.496 2.192-.496.832 0 1.563.166 2.192.496.63.331 1.115.803 1.456 1.416.341.614.512 1.336.512 2.168 0 .832-.17 1.555-.512 2.168a3.534 3.534 0 0 1-1.456 1.424c-.63.336-1.36.504-2.192.504Zm0-1.84c1.173 0 1.76-.753 1.76-2.257 0-.757-.152-1.322-.456-1.696-.304-.373-.739-.56-1.304-.56-1.173 0-1.76.752-1.76 2.256 0 1.504.587 2.256 1.76 2.256ZM100 15.686h-2.96l-3.008-3.503v3.504h-2.416V4.408h2.416v6.783l2.896-3.344h2.88l-3.296 3.744L100 15.689Z" fill="var(--ifm-svg-text-color)"/><path d="M.62 18.43 0 1.92A1.006 1.006 0 0 1 .944.88L14.984.002a1.005 1.005 0 0 1 1.069 1.004v17.989a1.006 1.006 0 0 1-1.051 1.004L1.58 19.396a1.006 1.006 0 0 1-.96-.967Z" fill="#FF4785"/><path fill-rule="evenodd" clip-rule="evenodd" d="m13.88.071-1.932.12-.094 2.267a.15.15 0 0 0 .24.126l.88-.668.744.586a.15.15 0 0 0 .243-.123l-.08-2.308Zm-1.504 7.59c-.353.275-2.989.462-2.989.071.056-1.493-.612-1.558-.984-1.558-.352 0-.946.106-.946.906 0 .815.868 1.275 1.887 1.815 1.447.767 3.2 1.696 3.2 4.032 0 2.24-1.82 3.476-4.14 3.476-2.395 0-4.488-.969-4.252-4.328.093-.394 3.138-.3 3.138 0-.038 1.386.278 1.794 1.076 1.794.613 0 .891-.338.891-.906 0-.861-.904-1.369-1.945-1.953-1.409-.791-3.067-1.722-3.067-3.859 0-2.132 1.466-3.554 4.084-3.554 2.618 0 4.047 1.4 4.047 4.064Z" fill="#fff"/></svg>
                </a>
              `
          },
          {
            position: 'right',
            href: 'https://github.com/microsoft-search/pnp-modern-search-core-components',
            html: `
                <a style="display:flex" href="https://github.com/microsoft-search/pnp-modern-search-core-components" target="_blank" rel="noreferrer noopener" aria-label="GitHub repository">
                  <svg viewBox="0 0 98 96" width="100%" height="22" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="var(--ifm-svg-text-color)"/></svg>
                </a>
              `,

          },
          {
            position: 'right',
            href: 'https://discord.com/channels/1095788595010338956/1096363589620731944',
            html: `
                <a style="display:flex" href="https://discord.com/channels/1095788595010338956/1096363589620731944" target="_blank" rel="noreferrer noopener" aria-label="Teams channel">
                  <img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" alt="Discord channel" width="22" />
                </a>
              `
          }          
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Misc',
            items: [
              {
                label: 'Web components playground',
                href: "https://azpnpmodernsearchcoresto.z9.web.core.windows.net/latest/index.html?path=/docs/introduction-getting-started--docs"
              },
              {
                label: 'Microsoft Search API reference',
                href: 'https://learn.microsoft.com/en-us/graph/search-concept-overview',
              }
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub repository',
                href: 'https://github.com/microsoft-search/pnp-modern-search-core-components',
              },
              {
                label: 'PnP',
                href: 'https://pnp.github.io/',
              },
              {
                label: 'Discord channel',
                href: 'https://discord.com/channels/1095788595010338956/1096363589620731944',
              },
            ],
          },
          {
            title: 'Misc',
            items: [
              {
                label: 'Ubisoft Microsoft Search implementation use case',
                href: 'https://discord.com/channels/1095788595010338956/1096363589620731944',
              },
              {
                label: 'Thanks',
                to: '/docs/thanks'
              },
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Microsoft 365 & Power Platform Community`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['json']
      },
    }),
    plugins: [
      async function myPlugin(context, options) {
        return {
          name: "docusaurus-tailwindcss",
          configurePostCss(postcssOptions) {
            // Appends TailwindCSS and AutoPrefixer.
            postcssOptions.plugins.push(require("tailwindcss"));
            postcssOptions.plugins.push(require("autoprefixer"));
            return postcssOptions;
          },
        };
      },
    ],
};

export default config;
