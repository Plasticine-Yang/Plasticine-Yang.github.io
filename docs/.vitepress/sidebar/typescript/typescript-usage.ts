import { ROUTES } from '../../routes'
import { DefaultTheme } from 'vitepress'

export const typescriptUsage: DefaultTheme.SidebarGroup[] = [
  {
    text: 'TypeScript 使用',
    items: [{ text: '不熟悉的知识', link: `${ROUTES.TYPESCRIPT_USAGE}unfamiliar-knowledge` }],
  },
]
