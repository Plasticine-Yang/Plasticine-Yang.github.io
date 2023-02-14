import { ROUTES } from '../../routes'
import { DefaultTheme } from 'vitepress'

const TOOLS = `${ROUTES.REACT_USAGE}tools`
const HOOKS = `${ROUTES.REACT_USAGE}hooks`

export const reactUsage: DefaultTheme.SidebarGroup[] = [
  {
    text: 'React 使用',
    items: [
      { text: '工具', items: [{ text: 'TypeScript 泛型', link: `${TOOLS}/typescript-generic/` }] },
      {
        text: 'hooks',
        items: [
          { text: 'useState', link: `${HOOKS}/use-state/` },
          { text: 'useRef', link: `${HOOKS}/use-ref/` },
        ],
      },
    ],
  },
]
