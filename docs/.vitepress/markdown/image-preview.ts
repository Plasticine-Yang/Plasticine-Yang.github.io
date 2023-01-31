import { HeadConfig } from 'vitepress'

/**
 * @description 配置 markdown 图片预览插件所需资源
 */
export const setupMarkdownImagePreview = (): HeadConfig[] => {
  return [
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.css',
      },
    ],
    [
      'script',
      {
        src: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js',
      },
    ],
  ]
}
