import type { MarkdownOptions } from 'vitepress'

// @ts-ignore
import mdItCustomAttrs from 'markdown-it-custom-attrs'

export const markdown: MarkdownOptions = {
  config(md) {
    // 图片预览
    md.use(mdItCustomAttrs, 'image', {
      'data-fancybox': 'gallery',
    })
  },
}
