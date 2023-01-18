import { ROUTES } from '../routes'
import { DefaultTheme } from 'vitepress'

const NEST = `${ROUTES.BACKEND}nest`

export const backend: DefaultTheme.SidebarGroup[] = [
  {
    text: 'NestJS',
    items: [{ text: '基础使用', link: `${NEST}/basic` }],
  },
]
