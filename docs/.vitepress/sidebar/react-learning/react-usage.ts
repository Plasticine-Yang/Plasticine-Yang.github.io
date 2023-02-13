import { ROUTES } from '../../routes'
import { DefaultTheme } from 'vitepress'

export const reactUsage: DefaultTheme.SidebarGroup[] = [
  {
    text: 'React 使用',
    items: [{ text: 'TypeScript 泛型', link: `${ROUTES.REACT_USAGE}typescript-generic/` }],
  },
]
