import { ROUTES } from '../routes'
import { DefaultTheme } from 'vitepress'

/** @description 理论篇路由前缀 */
const THEORETICAL_CHAPTER = `${ROUTES.FE_MONITOR_SYSTEM}theoretical-chapter`

/** @description 实战篇路由前缀 */
const CODING_CHAPTER = `${ROUTES.FE_MONITOR_SYSTEM}coding-chapter`

/** @description Sentry SDK 架构分析 */
const SENTRY_SDK_ARCHITECUTRE = `${THEORETICAL_CHAPTER}/sentry-sdk-architecture`

export const feMonitorSystem: DefaultTheme.SidebarGroup[] = [
  {
    text: '前端监控系统',
    items: [
      // 理论篇
      {
        text: '理论篇',
        items: [
          { text: '基础知识', link: `${THEORETICAL_CHAPTER}/basic/` },
          { text: '错误监控', link: `${THEORETICAL_CHAPTER}/error-monitor/` },
          {
            text: 'Sentry SDK 架构分析',
            items: [{ text: '核心流程', link: `${SENTRY_SDK_ARCHITECUTRE}/core-process/` }],
          },
          { text: '服务端相关技术栈学习', link: `${THEORETICAL_CHAPTER}/server-stack-learning/` },
        ],
      },

      // 实战篇
      {
        text: '实战篇',
        items: [
          { text: '监控系统整体架构', link: `${CODING_CHAPTER}/system-architecture/` },
          { text: 'SDK 架构', link: `${CODING_CHAPTER}/sdk-architecture/` },
          { text: '服务端架构', link: `${CODING_CHAPTER}/server-architecture/` },
        ],
      },
    ],
  },
]
