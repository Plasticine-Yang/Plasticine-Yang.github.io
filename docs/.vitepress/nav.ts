import { DefaultTheme } from 'vitepress'
import { ROUTES } from './routes'

export const nav: DefaultTheme.Config['nav'] = [
  { text: '首页', link: '/' },
  {
    text: '分类',
    items: [
      { text: 'TypeScript 类型挑战', link: `${ROUTES.TYPE_CHALLENGES}easy` },
    ],
  },
]
