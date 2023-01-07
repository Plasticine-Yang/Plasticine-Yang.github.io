import { DefaultTheme } from 'vitepress'
import { ROUTES } from './routes'

export const nav: DefaultTheme.Config['nav'] = [
  { text: '首页', link: '/' },
  {
    text: 'TypeScript 类型挑战',
    link: `${ROUTES.TYPE_CHALLENGES}easy`,
    activeMatch: ROUTES.TYPE_CHALLENGES,
  },
]
