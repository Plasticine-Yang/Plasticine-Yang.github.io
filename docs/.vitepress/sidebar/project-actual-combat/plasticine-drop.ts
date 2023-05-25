import { DefaultTheme } from 'vitepress'
import { ROUTES } from '../../routes'

export const plasticineDrop: DefaultTheme.SidebarGroup[] = [
  {
    text: '基于 WebRTC 进行数据共享',
    items: [{ text: '项目介绍', link: `${ROUTES.PROJECT_ACTUAL_COMBAT_PLASTICINE_DROP}introduction/` }],
  },
]
