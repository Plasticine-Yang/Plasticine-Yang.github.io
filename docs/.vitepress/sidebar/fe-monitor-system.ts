import { ROUTES } from '../routes'
import { DefaultTheme } from 'vitepress'

/** @description 理论篇路由前缀 */
const THEORETICAL_CHAPTER = `${ROUTES.FE_MONITOR_SYSTEM}theoretical-chapter`

/** @description 实战篇路由前缀 */
const CODING_CHAPTER = `${ROUTES.FE_MONITOR_SYSTEM}coding-chapter`

/** @description 理论篇 - Sentry SDK 架构分析 */
const THEO_SENTRY_SDK_ARCHITECTURE = `${THEORETICAL_CHAPTER}/sentry-sdk-architecture`

/** @description 理论篇 - Sentry SDK 源码分析 */
const THEO_SENTRY_SDK_SOURCE = `${THEORETICAL_CHAPTER}/sentry-sdk-source`

/** @description 实战篇 - SDK 实现 */
const CODING_SDK = `${CODING_CHAPTER}/sdk`

export const feMonitorSystem: DefaultTheme.SidebarGroup[] = [
  {
    text: '前端监控系统',
    items: [
      // 理论篇
      {
        text: '理论篇',
        items: [
          { text: '基础知识', link: `${THEORETICAL_CHAPTER}/basic/` },
          { text: '异常监控', link: `${THEORETICAL_CHAPTER}/error-monitor/` },
          {
            text: 'Sentry SDK 架构分析',
            items: [
              { text: '初始化流程', link: `${THEO_SENTRY_SDK_ARCHITECTURE}/init/` },
              { text: '异常监控流程', link: `${THEO_SENTRY_SDK_ARCHITECTURE}/error-monitor/` },
            ],
          },
          {
            text: 'Sentry SDK 源码分析',
            items: [
              { text: 'Scope', link: `${THEO_SENTRY_SDK_SOURCE}/scope/` },
              { text: 'Hub', link: `${THEO_SENTRY_SDK_SOURCE}/hub/` },
            ],
          },
          { text: '服务端相关技术栈学习', link: `${THEORETICAL_CHAPTER}/server-stack-learning/` },
        ],
      },

      // 实战篇
      {
        text: '实战篇',
        items: [
          { text: '介绍', link: `${CODING_CHAPTER}/introduction/` },

          {
            text: 'SDK 实现',
            items: [
              { text: '架构', link: `${CODING_SDK}/architecture/` },
              { text: '初始化流程', link: `${CODING_SDK}/init/` },
            ],
          },
        ],
      },
    ],
  },
]
