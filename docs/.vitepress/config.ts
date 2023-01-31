import { defineConfig } from 'vitepress'

import { LOGO_PATH } from './constants'
import { markdown } from './markdown'
import { setupMarkdownImagePreview } from './markdown/image-preview'

import { nav } from './nav'
import { sidebar } from './sidebar'

export default defineConfig({
  title: 'Plasticine FE Diary',
  head: [
    ['link', { rel: 'icon', href: LOGO_PATH }],
    // 图片预览所需资源
    ...setupMarkdownImagePreview(),
  ],
  lastUpdated: true,
  themeConfig: {
    logo: LOGO_PATH,
    nav,
    sidebar,
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

    // 文章右侧大纲显示 2 ~ 5 层级
    outline: [2, 5],
    outlineTitle: '目录',
  },
  markdown,
})
