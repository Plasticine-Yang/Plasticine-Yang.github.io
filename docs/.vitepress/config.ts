import { defineConfig } from 'vitepress'

import { LOGO_PATH } from './constants'

export default defineConfig({
  title: 'Plasticine FE Diary',
  head: [['link', { rel: 'icon', href: LOGO_PATH }]],
  themeConfig: {
    logo: LOGO_PATH,
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/Plasticine-Yang/Plasticine-Yang.github.io',
      },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present Plasticine-Yang',
    },
  },
})
