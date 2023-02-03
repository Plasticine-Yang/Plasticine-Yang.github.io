import { ROUTES } from '../routes'
import { DefaultTheme } from 'vitepress'

export const rust: DefaultTheme.SidebarGroup[] = [
  {
    text: 'Rust',
    items: [{ text: '介绍', link: `${ROUTES.RUST}introduction/` }],
  },
]
