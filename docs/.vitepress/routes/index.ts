import { algorithm } from './algorithm'
import { backend } from './backend'
import { frameworkSourceLearning } from './framework-source-learning'
import { git } from './git'
import { linux } from './linux'
import { projects } from './projects'
import { typescript } from './typescript'

export const routes = {
  /** 框架源码学习 */
  frameworkSourceLearning,

  /** 项目 */
  projects,

  /** TypeScript */
  typescript,

  /** 算法 */
  algorithm,

  /** 后端 */
  backend,

  /** Linux */
  linux,

  /** Git */
  git,
}
