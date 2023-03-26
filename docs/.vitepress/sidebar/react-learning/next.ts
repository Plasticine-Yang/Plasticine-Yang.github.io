import { DefaultTheme } from 'vitepress'
import { ROUTES } from '../../routes'

export const next: DefaultTheme.SidebarGroup[] = [
  {
    text: 'Next.js',
    items: [{ text: '快速了解 Next.js', link: `${ROUTES.NEXT}quick-learn/` }],
  },
]
