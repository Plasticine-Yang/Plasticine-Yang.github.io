import { DefaultTheme } from 'vitepress'

import { routes } from './routes'

export const nav: DefaultTheme.Config['nav'] = [
  { text: '首页', link: '/' },

  {
    text: '框架源码学习',
    activeMatch: routes.frameworkSourceLearning.root,
    items: [
      {
        text: 'React',
        link: `${routes.frameworkSourceLearning.root}/01-jsx/`,
      },
    ],
  },

  {
    text: '项目',
    activeMatch: routes.projects.root,
    items: [
      {
        text: '基于 Islands 架构的 SSG 框架',
        link: `${routes.projects.plasticineIslands}/introduction/`,
      },
    ],
  },

  {
    text: 'TypeScript',
    activeMatch: routes.typescript.root,
    items: [{ text: 'TypeScript 类型挑战', link: `${routes.typescript.typeChallenges}/summary` }],
  },

  {
    text: '后端',
    activeMatch: routes.backend.root,
    items: [
      {
        text: 'NestJS',
        link: `${routes.backend.nest}/basic/`,
      },
    ],
  },

  {
    text: '算法',
    activeMatch: routes.algorithm.root,
    items: [
      {
        text: '数组',
        link: `${routes.algorithm.array}/binary-search/`,
      },
      {
        text: '链表',
        link: `${routes.algorithm.linkedList}/flip-linked-list/`,
      },
      {
        text: '二叉树',
        link: `${routes.algorithm.binaryTree}/bfs/`,
      },
    ],
  },

  { text: 'Linux', link: `${routes.linux.root}/` },

  { text: 'Git', link: `${routes.git.root}/` },
]
