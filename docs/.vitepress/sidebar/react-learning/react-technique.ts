import { ROUTES } from '../../routes'
import { DefaultTheme } from 'vitepress'

export const reactTechnique: DefaultTheme.SidebarGroup[] = [
  {
    text: 'React 使用技巧',
    items: [
      { text: 'useEffect 汇总', link: `${ROUTES.REACT_TECHNIQUE}use-effect/` },
      { text: 'useRef 汇总', link: `${ROUTES.REACT_TECHNIQUE}use-ref/` },
    ],
  },
]
