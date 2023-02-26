import { ROUTES } from '../../routes'
import { DefaultTheme } from 'vitepress'

const TOOLS = `${ROUTES.REACT_BASIC}tools`
const HOOKS = `${ROUTES.REACT_BASIC}hooks`
const RENDERING = `${ROUTES.REACT_BASIC}rendering`

export const reactBasic: DefaultTheme.SidebarGroup[] = [
  {
    text: 'React 基础',
    items: [
      { text: '介绍', link: `${ROUTES.REACT_BASIC}introduction/` },
      { text: '工具', items: [{ text: 'TypeScript 泛型', link: `${TOOLS}/typescript-generic/` }] },
      { text: '渲染', items: [{ text: '如何理解 SSR 中的 hydrate?', link: `${RENDERING}/understanding-hydration/` }] },
      {
        text: 'hooks',
        items: [
          { text: 'useState', link: `${HOOKS}/use-state/` },
          { text: 'useEffect', link: `${HOOKS}/use-effect/` },
          { text: 'useRef', link: `${HOOKS}/use-ref/` },
        ],
      },
    ],
  },
]
